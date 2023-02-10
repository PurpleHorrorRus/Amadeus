'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vkIo = require('vk-io');
var createDebug = require('debug');
var cheerio = require('cheerio');
var abortController = require('abort-controller');
var url = require('url');
var fetch = require('node-fetch');
var toughCookie = require('tough-cookie');
var crypto = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var createDebug__default = /*#__PURE__*/_interopDefaultLegacy(createDebug);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

const { DEBUG = '' } = process.env;
const isDebug = DEBUG.includes('vk-io:authorization');
class AuthorizationError extends vkIo.VKError {
    /**
     * Constructor
     */
    constructor({ message, code, pageHtml }) {
        super({ message, code });
        this.pageHtml = isDebug
            ? pageHtml
            : undefined;
    }
}

/**
 * Blank html redirect
 */
const CALLBACK_BLANK = 'https://oauth.vk.com/blank.html';
/**
 * User-Agent for standalone auth
 */
const DESKTOP_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36';
/**
 * Auth error codes
 */
exports.AuthErrorCode = void 0;
(function (AuthErrorCode) {
    AuthErrorCode["PAGE_BLOCKED"] = "PAGE_BLOCKED";
    AuthErrorCode["INVALID_PHONE_NUMBER"] = "INVALID_PHONE_NUMBER";
    AuthErrorCode["AUTHORIZATION_FAILED"] = "AUTHORIZATION_FAILED";
    AuthErrorCode["FAILED_PASSED_CAPTCHA"] = "FAILED_PASSED_CAPTCHA";
    AuthErrorCode["FAILED_PASSED_TWO_FACTOR"] = "FAILED_PASSED_TWO_FACTOR";
    AuthErrorCode["USERNAME_OR_PASSWORD_IS_INCORRECT"] = "USERNAME_OR_PASSWORD_IS_INCORRECT";
    AuthErrorCode["TOO_MUCH_TRIES"] = "TOO_MUCH_TRIES";
    AuthErrorCode["WRONG_OTP"] = "WRONG_OTP";
    AuthErrorCode["OTP_FORMAT_IS_INCORRECT"] = "OTP_FORMAT_IS_INCORRECT";
})(exports.AuthErrorCode || (exports.AuthErrorCode = {}));
/**
 * List of user permissions and their bit mask
 */
const userScopes = new Map([
    ['notify', 1],
    ['friends', 2],
    ['photos', 4],
    ['audio', 8],
    ['video', 16],
    ['pages', 128],
    ['link', 256],
    ['status', 1024],
    ['notes', 2048],
    ['messages', 4096],
    ['wall', 8192],
    ['ads', 32768],
    ['offline', 65536],
    ['docs', 131072],
    ['groups', 262144],
    ['notifications', 524288],
    ['stats', 1048576],
    ['email', 4194304],
    ['market', 134217728]
]);
/**
 * List of group permissions and their bit mask
 */
const groupScopes = new Map([
    ['stories', 1],
    ['photos', 4],
    // ['app_widget', 64],
    ['messages', 4096],
    ['docs', 131072],
    ['manage', 262144]
]);
const officialAppCredentials = {
    android: {
        clientId: '2274003',
        clientSecret: 'hHbZxrka2uZ6jB1inYsH',
        headers: {
			'User-Agent': 'VKAndroidApp/7.7-10445 (Android 11; SDK 30; arm64-v8a; Xiaomi M2003J15SC; ru; 2340x1080)'
		}
    },
    windows: {
        clientId: '3697615',
        clientSecret: 'AlVXZFMUqyrnABp8ncuU'
    },
    windowsPhone: {
        clientId: '3502557',
        clientSecret: 'PEObAuQi6KloPM4T30DV'
    },
    iphone: {
        clientId: '3140623',
        clientSecret: 'VeWdmVclDCtn6ihuP1nt'
    },
    ipad: {
        clientId: '3682744',
        clientSecret: 'mY6CDUswIVdJLCD3j15n'
    },
    vkMe: {
        clientId: '6146827',
        clientSecret: 'qVxWRF1CwHERuIrKBnqe'
    }
};

const debug$5 = createDebug__default['default']('vk-io:util:fetch-cookie');
const userAgentRe = /^User-Agent$/i;
const redirectCodes = new Set([303, 301, 302]);
const findUserAgent = (headers) => {
    if (!headers) {
        return undefined;
    }
    const key = Object.keys(headers)
        .find((header) => userAgentRe.test(header));
    if (!key) {
        return undefined;
    }
    return headers[key];
};
const fetchCookieDecorator = (jar = new toughCookie.CookieJar()) => (async function fetchCookie(url, options = {}) {
    const previousCookie = await jar.getCookieString(String(url));
    const { headers = {} } = options;
    if (previousCookie) {
        headers.cookie = previousCookie;
    }
    debug$5('fetch url %s', url);
    const response = await fetch__default['default'](url, {
        ...options,
        headers
    });
    const { 'set-cookie': cookies = [] } = response.headers.raw();
    if (cookies.length === 0) {
        return response;
    }
    await Promise.all(cookies.map((cookie) => (jar.setCookie(cookie, response.url))));
    return response;
});
const fetchCookieFollowRedirectsDecorator = (jar) => {
    const fetchCookie = fetchCookieDecorator(jar);
    return async function fetchCookieFollowRedirects(url, options = {}) {
        const response = await fetchCookie(url, {
            ...options,
            redirect: 'manual'
        });
        const isRedirect = redirectCodes.has(response.status);
        if (isRedirect && options.redirect !== 'manual' && options.follow !== 0) {
            const location = response.headers.get('location');
            debug$5('Redirect to', location);
            if (!location) {
                throw new Error('Location header missing');
            }
            let follow;
            if (options.follow) {
                follow = options.follow - 1;
            }
            const userAgent = findUserAgent(options.headers);
            const headers = userAgent !== undefined
                // eslint-disable-next-line @typescript-eslint/naming-convention
                ? { 'User-Agent': userAgent }
                : {};
            const redirectResponse = await fetchCookieFollowRedirects(location, {
                method: 'GET',
                body: undefined,
                agent: options.agent,
                headers,
                follow
            });
            return redirectResponse;
        }
        return response;
    };
};

/**
 * Returns the bit mask of the user permission by name
 */
const getUserPermissionsByName = (rawScope) => {
    const scope = !Array.isArray(rawScope)
        ? rawScope.split(/,\s*/)
        : rawScope;
    let bitMask = 0;
    for (const name of scope) {
        const scopeBit = userScopes.get(name);
        if (scopeBit) {
            bitMask += scopeBit;
        }
    }
    return bitMask;
};
/**
 * Returns the bit mask of the group permission by name
 */
const getGroupPermissionsByName = (rawScope) => {
    const scope = !Array.isArray(rawScope)
        ? rawScope.split(/,\s*/)
        : rawScope;
    let bitMask = 0;
    for (const name of scope) {
        const scopeBit = groupScopes.get(name);
        if (scopeBit) {
            bitMask += scopeBit;
        }
    }
    return bitMask;
};
const getAllUserPermissions = () => (getUserPermissionsByName([...userScopes.keys()]));
const getAllGroupPermissions = () => (getGroupPermissionsByName([...groupScopes.keys()]));
/**
 * Parse form
 */
const parseFormField = ($) => {
    const $form = $('form[action][method]');
    const fields = {};
    for (const { name, value } of $form.serializeArray()) {
        fields[name] = value;
    }
    return {
        action: $form.attr('action'),
        fields
    };
};
/**
 * Returns full URL use Response
 */
const getFullURL = (action, { url: url$1 }) => {
    if (action.startsWith('https://')) {
        return new url.URL(action);
    }
    const { protocol, host } = new url.URL(url$1);
    return new url.URL(action, `${protocol}//${host}`);
};

const debug$4 = createDebug__default['default']('vk-io:authorization:direct');
const { INVALID_PHONE_NUMBER: INVALID_PHONE_NUMBER$2, AUTHORIZATION_FAILED: AUTHORIZATION_FAILED$4, FAILED_PASSED_CAPTCHA: FAILED_PASSED_CAPTCHA$2, FAILED_PASSED_TWO_FACTOR: FAILED_PASSED_TWO_FACTOR$2, USERNAME_OR_PASSWORD_IS_INCORRECT, TOO_MUCH_TRIES, WRONG_OTP, OTP_FORMAT_IS_INCORRECT } = exports.AuthErrorCode;
/**
 * Number of two-factorial attempts
 */
const TWO_FACTOR_ATTEMPTS$2 = 3;
/**
 * Number of captcha attempts
 */
const CAPTCHA_ATTEMPTS$1 = 3;
/**
 * Phone number check action
 */
const ACTION_SECURITY_CODE$2 = 'act=security';
class DirectAuthorization {
    /**
     * Constructor
     */
    constructor(options) {
        this.captchaAttempts = 0;
        this.twoFactorAttempts = 0;
        this.options = {
            timeout: 10000,
            ...options
        };
        this.started = false;
        this.captchaValidate = undefined;
        this.captchaAttempts = 0;
        this.twoFactorValidate = undefined;
        this.twoFactorAttempts = 0;
    }
    /**
     * Returns custom tag
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    /**
     * Executes the HTTP request
     */
    fetch(url, options = {}) {
        const { agent, timeout } = this.options;
        const controller = new abortController.AbortController();
        const interval = setTimeout(() => controller.abort(), timeout);
        return this.fetchCookie(url, {
            ...options,
            headers: this.options.headers,
            agent,
            signal: controller.signal,
            compress: false
        }).finally(() => clearTimeout(interval));
    }
    /**
     * Returns permission page
     */
    getPermissionsPage(query = {}) {
        let { scope } = this.options;
        if (scope === undefined) {
            throw new Error('Required option "scope" not set');
        }
        if (scope === 'all') {
            scope = getAllUserPermissions();
        }
        else if (typeof scope !== 'number') {
            scope = getUserPermissionsByName(scope);
        }
        debug$4('auth scope %s', scope);
        const { clientId, clientSecret, login, phone, password, apiVersion } = this.options;
        const params = new url.URLSearchParams({
            ...query,
            username: String(login || phone),
            grant_type: 'password',
            client_secret: clientSecret,
            '2fa_supported': String(this.options.callbackService.hasTwoFactorHandler
                ? 1
                : 0),
            v: apiVersion,
            client_id: clientId,
            password,
            scope: String(scope)
        });
        const url$1 = new url.URL(`https://oauth.vk.com/token?${params}`);
        return this.fetch(url$1, {
            method: 'GET'
        });
    }
    /**
     * Runs authorization
     */
    async run() {
        if (this.started) {
            throw new AuthorizationError({
                message: 'Authorization already started!',
                code: AUTHORIZATION_FAILED$4
            });
        }
        this.started = true;
        this.fetchCookie = fetchCookieFollowRedirectsDecorator();
        let response = await this.getPermissionsPage();
        let text;
        const isProcessed = true;
        while (isProcessed) {
            text = await response.text();
            let isJSON = true;
            try {
                text = JSON.parse(text);
            }
            catch (e) {
                isJSON = false;
            }
            if (isJSON) {
                if (text.access_token !== undefined) {
                    const { email, user_id: user, expires_in: expires, access_token: token } = text;
                    return {
                        email,
                        user: user !== undefined
                            ? Number(user)
                            : 0,
                        token,
                        expires: expires
                            ? Number(expires)
                            : 0
                    };
                }
                if (text.error !== undefined) {
                    if (text.error === 'invalid_client') {
                        if (text.error_type === 'username_or_password_is_incorrect') {
                            throw new AuthorizationError({
                                message: 'Username or password is incorrect.',
                                code: USERNAME_OR_PASSWORD_IS_INCORRECT
                            });
                        }
                        throw new AuthorizationError({
                            message: `Invalid client (${text.error_type}: ${text.error_description})`,
                            code: AUTHORIZATION_FAILED$4
                        });
                    }
                    if (text.error === 'need_captcha') {
                        response = await this.processCaptcha(text);
                        continue;
                    }
                    if (text.error === 'need_validation') {
                        if (text.validation_type !== undefined) {
                            response = await this.processTwoFactor(text);
                            continue;
                        }
                        const $ = cheerio.load(text);
                        response = await this.processSecurityForm(response, $);
                        continue;
                    }
                    if (text.error === 'invalid_request') {
                        if (text.error_type === 'too_much_tries') {
                            throw new AuthorizationError({
                                message: 'Too much authorization tries. Try again later in a few hours.',
                                code: TOO_MUCH_TRIES
                            });
                        }
                        if (text.error_type === 'wrong_otp') {
                            throw new AuthorizationError({
                                message: 'Wrong two factor code.',
                                code: WRONG_OTP
                            });
                        }
                        if (text.error_type === 'otp_format_is_incorrect') {
                            throw new AuthorizationError({
                                message: 'Invalid two factor code format.',
                                code: OTP_FORMAT_IS_INCORRECT
                            });
                        }
                    }
                    throw new AuthorizationError({
                        message: 'Unsupported type validation',
                        code: AUTHORIZATION_FAILED$4
                    });
                }
            }
            throw new AuthorizationError({
                message: 'Authorization failed',
                code: AUTHORIZATION_FAILED$4
            });
        }
        throw new Error('Fallback error');
    }
    /**
     * Process captcha
     */
    async processCaptcha({ captcha_sid: sid, captcha_img: src }) {
        debug$4('captcha process');
        if (this.captchaValidate !== undefined) {
            this.captchaValidate.reject(new AuthorizationError({
                message: 'Incorrect captcha code',
                code: FAILED_PASSED_CAPTCHA$2
            }));
            this.captchaValidate = undefined;
            this.captchaAttempts += 1;
        }
        if (this.captchaAttempts >= CAPTCHA_ATTEMPTS$1) {
            throw new AuthorizationError({
                message: 'Maximum attempts passage captcha',
                code: FAILED_PASSED_CAPTCHA$2
            });
        }
        const { key, validate } = await this.options.callbackService.processingCaptcha({
            type: vkIo.CaptchaType.DIRECT_AUTH,
            sid,
            src
        });
        this.captchaValidate = validate;
        const response = await this.getPermissionsPage({
            captcha_sid: sid,
            captcha_key: key
        });
        return response;
    }
    /**
     * Process two-factor
     */
    async processTwoFactor({ validation_type: validationType, phone_mask: phoneMask }) {
        debug$4('process two-factor handle');
        if (this.twoFactorValidate !== undefined) {
            this.twoFactorValidate.reject(new AuthorizationError({
                message: 'Incorrect two-factor code',
                code: FAILED_PASSED_TWO_FACTOR$2
            }));
            this.twoFactorValidate = undefined;
            this.twoFactorAttempts += 1;
        }
        if (this.twoFactorAttempts >= TWO_FACTOR_ATTEMPTS$2) {
            throw new AuthorizationError({
                message: 'Failed passed two-factor authentication',
                code: FAILED_PASSED_TWO_FACTOR$2
            });
        }
        const { code, validate } = await this.options.callbackService.processingTwoFactor({
            phoneMask,
            type: validationType === '2fa_app'
                ? 'app'
                : 'sms'
        });
        this.twoFactorValidate = validate;
        const response = await this.getPermissionsPage({ code });
        return response;
    }
    /**
     * Process security form
     */
    async processSecurityForm(response, $) {
        debug$4('process security form');
        const { login, phone } = this.options;
        let number;
        if (phone !== undefined) {
            number = phone;
        }
        else if (login !== undefined && !login.includes('@')) {
            number = login;
        }
        else {
            throw new AuthorizationError({
                message: 'Missing phone number in the phone or login field',
                code: INVALID_PHONE_NUMBER$2
            });
        }
        if (typeof number === 'string') {
            number = number.trim().replace(/^(\+|00)/, '');
        }
        number = String(number);
        const $field = $('.field_prefix');
        const prefix = $field.first().text().trim().replace('+', '').length;
        const postfix = $field.last().text().trim().length;
        const { action, fields } = parseFormField($);
        fields.code = number.slice(prefix, number.length - postfix);
        const url$1 = getFullURL(action, response);
        const rewResponse = await this.fetch(url$1, {
            method: 'POST',
            body: new url.URLSearchParams(fields)
        });
        if (rewResponse.url.includes(ACTION_SECURITY_CODE$2)) {
            throw new AuthorizationError({
                message: 'Invalid phone number',
                code: INVALID_PHONE_NUMBER$2
            });
        }
        return rewResponse;
    }
}

const debug$3 = createDebug__default['default']('vk-io:authorization:implicit-flow');
const { PAGE_BLOCKED, INVALID_PHONE_NUMBER: INVALID_PHONE_NUMBER$1, AUTHORIZATION_FAILED: AUTHORIZATION_FAILED$3, FAILED_PASSED_CAPTCHA: FAILED_PASSED_CAPTCHA$1, FAILED_PASSED_TWO_FACTOR: FAILED_PASSED_TWO_FACTOR$1 } = exports.AuthErrorCode;
/**
 * Blocked action
 */
const ACTION_BLOCKED = 'act=blocked';
/**
 * Two-factor auth check action
 */
const ACTION_AUTH_CODE$1 = 'act=authcheck';
/**
 * Phone number check action
 */
const ACTION_SECURITY_CODE$1 = 'act=security';
/**
 * Number of two-factorial attempts
 */
const TWO_FACTOR_ATTEMPTS$1 = 3;
/**
 * Number of captcha attempts
 */
const CAPTCHA_ATTEMPTS = 3;
/**
 * Removes the prefix
 */
const REPLACE_PREFIX_RE = /^[+|0]+/;
/**
 * Find location.href text
 */
const FIND_LOCATION_HREF_RE = /location\.href\s*=\s*['"]([^'"]+)['"]/i;
class ImplicitFlow {
    /**
     * Constructor
     */
    constructor(options) {
        this.captchaAttempts = 0;
        this.twoFactorAttempts = 0;
        this.options = {
            timeout: 10000,
            ...options
        };
        this.jar = new toughCookie.CookieJar();
        this.started = false;
        this.captchaValidate = undefined;
        this.captchaAttempts = 0;
        this.twoFactorValidate = undefined;
        this.twoFactorAttempts = 0;
    }
    /**
     * Returns custom tag
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    /**
     * Returns CookieJar
     */
    get cookieJar() {
        return this.jar;
    }
    /**
     * Sets the CookieJar
     */
    set cookieJar(jar) {
        this.jar = jar;
    }
    /**
     * Returns cookie
     */
    async getCookies() {
        const { jar } = this;
        const [login, main] = await Promise.all([
            jar.getCookieString('https://login.vk.com'),
            jar.getCookieString('https://vk.com')
        ]);
        return {
            'login.vk.com': login,
            'vk.com': main
        };
    }
    /**
     * Executes the HTTP request
     */
    fetch(url, options = {}) {
        const { agent, timeout } = this.options;
        const controller = new abortController.AbortController();
        const interval = setTimeout(() => controller.abort(), timeout);
        return this.fetchCookie(url, {
            ...options,
            headers: this.options.headers,
            agent,
            signal: controller.signal,
            compress: false
        }).finally(() => clearTimeout(interval));
    }
    /**
     * Runs authorization
     */
    async login() {
        if (this.started) {
            throw new AuthorizationError({
                message: 'Authorization already started!',
                code: AUTHORIZATION_FAILED$3
            });
        }
        this.started = true;
        this.fetchCookie = fetchCookieFollowRedirectsDecorator(this.jar);
        debug$3('get permissions page');
        let response = await this.getPermissionsPage();
        const isProcessed = true;
        while (isProcessed) {
            const { url } = response;
            debug$3('URL', url);
            if (url.includes(CALLBACK_BLANK)) {
                return { response };
            }
            if (url.includes(ACTION_BLOCKED)) {
                debug$3('page blocked');
                throw new AuthorizationError({
                    message: 'Page blocked',
                    code: PAGE_BLOCKED
                });
            }
            const $ = cheerio.load(await response.text());
            if (url.includes(ACTION_AUTH_CODE$1)) {
                response = await this.processTwoFactorForm(response, $);
                continue;
            }
            if (url.includes(ACTION_SECURITY_CODE$1)) {
                response = await this.processSecurityForm(response, $);
                continue;
            }
            const $error = $('.box_error');
            const $service = $('.service_msg_warning');
            const isError = $error.length !== 0;
            if (this.captchaValidate === undefined && (isError || $service.length !== 0)) {
                const errorText = isError
                    ? $error.text()
                    : $service.text();
                throw new AuthorizationError({
                    message: `Auth form error: ${errorText}`,
                    code: AUTHORIZATION_FAILED$3,
                    pageHtml: $.html()
                });
            }
            if ($('input[name="pass"]').length !== 0) {
                response = await this.processAuthForm(response, $);
                continue;
            }
            if (url.includes('act=')) {
                throw new AuthorizationError({
                    message: 'Unsupported authorization event',
                    code: AUTHORIZATION_FAILED$3,
                    pageHtml: $.html()
                });
            }
            debug$3('auth with login & pass complete');
            if ($('form').length !== 0) {
                const { action } = parseFormField($);
                debug$3('url grant access', action);
                response = await this.fetch(action, {
                    method: 'POST'
                });
            }
            else {
                const locations = $.html().match(FIND_LOCATION_HREF_RE) || undefined;
                if (locations === undefined) {
                    throw new AuthorizationError({
                        message: 'Could not log in',
                        code: AUTHORIZATION_FAILED$3,
                        pageHtml: $.html()
                    });
                }
                const location = locations[1].replace('&cancel=1', '');
                debug$3('url grant access', location);
                response = await this.fetch(location, {
                    method: 'POST'
                });
            }
        }
        throw new Error('Fallback error');
    }
    /**
     * Process form auth
     */
    async processAuthForm(response, $) {
        debug$3('process login handle');
        if (this.captchaValidate) {
            this.captchaValidate.reject(new AuthorizationError({
                message: 'Incorrect captcha code',
                code: FAILED_PASSED_CAPTCHA$1,
                pageHtml: $.html()
            }));
            this.captchaValidate = undefined;
            this.captchaAttempts += 1;
        }
        if (this.captchaAttempts > CAPTCHA_ATTEMPTS) {
            throw new AuthorizationError({
                message: 'Maximum attempts passage captcha',
                code: FAILED_PASSED_CAPTCHA$1
            });
        }
        const { login, password, phone } = this.options;
        const { action, fields } = parseFormField($);
        fields.email = String(login || phone);
        fields.pass = String(password);
        if (fields.captcha_sid !== undefined) {
            const src = $('.oauth_captcha').attr('src') || $('#captcha').attr('src');
            if (!src) {
                throw new AuthorizationError({
                    message: 'Failed get captcha image',
                    code: AUTHORIZATION_FAILED$3
                });
            }
            const { key, validate } = await this.options.callbackService.processingCaptcha({
                type: vkIo.CaptchaType.IMPLICIT_FLOW_AUTH,
                sid: fields.captcha_sid,
                src
            });
            this.captchaValidate = validate;
            fields.captcha_key = key;
        }
        debug$3('Fields', fields);
        const url$1 = new url.URL(action);
        url$1.searchParams.set('utf8', '1');
        const pageResponse = await this.fetch(url$1, {
            method: 'POST',
            body: new url.URLSearchParams(fields)
        });
        return pageResponse;
    }
    /**
     * Process two-factor form
     */
    async processTwoFactorForm(response, $) {
        debug$3('process two-factor handle');
        if (this.twoFactorValidate !== undefined) {
            this.twoFactorValidate.reject(new AuthorizationError({
                message: 'Incorrect two-factor code',
                code: FAILED_PASSED_TWO_FACTOR$1,
                pageHtml: $.html()
            }));
            this.twoFactorAttempts += 1;
        }
        if (this.twoFactorAttempts >= TWO_FACTOR_ATTEMPTS$1) {
            throw new AuthorizationError({
                message: 'Failed passed two-factor authentication',
                code: FAILED_PASSED_TWO_FACTOR$1
            });
        }
        const { action, fields } = parseFormField($);
        const { code, validate } = await this.options.callbackService.processingTwoFactor({});
        fields.code = code;
        try {
            const url$1 = getFullURL(action, response);
            const newResponse = await this.fetch(url$1, {
                method: 'POST',
                body: new url.URLSearchParams(fields)
            });
            return newResponse;
        }
        catch (error) {
            validate.reject(error);
            throw error;
        }
    }
    /**
     * Process security form
     */
    async processSecurityForm(response, $) {
        debug$3('process security form');
        const { login, phone } = this.options;
        let number;
        if (phone !== undefined) {
            number = phone;
        }
        else if (login !== undefined && !login.includes('@')) {
            number = login;
        }
        else {
            throw new AuthorizationError({
                message: 'Missing phone number in the phone or login field',
                code: INVALID_PHONE_NUMBER$1,
                pageHtml: $.html()
            });
        }
        number = String(number).trim().replace(REPLACE_PREFIX_RE, '');
        const $field = $('.field_prefix');
        const { length: prefix } = $field.first().text().trim().replace(REPLACE_PREFIX_RE, '');
        const { length: postfix } = $field.last().text().trim();
        const { action, fields } = parseFormField($);
        fields.code = number.slice(prefix, number.length - postfix);
        const url$1 = getFullURL(action, response);
        const newResponse = await this.fetch(url$1, {
            method: 'POST',
            body: new url.URLSearchParams(fields)
        });
        if (newResponse.url.includes(ACTION_SECURITY_CODE$1)) {
            throw new AuthorizationError({
                message: 'Invalid phone number',
                code: INVALID_PHONE_NUMBER$1,
                pageHtml: $.html()
            });
        }
        return newResponse;
    }
}

const debug$2 = createDebug__default['default']('vk-io:authorization:implicit-flow-user');
const { AUTHORIZATION_FAILED: AUTHORIZATION_FAILED$2 } = exports.AuthErrorCode;
class ImplicitFlowUser extends ImplicitFlow {
    /**
     * Returns permission page
     */
    getPermissionsPage() {
        const { clientId } = this.options;
        let { scope } = this.options;
        if (scope === undefined) {
            throw new Error('Required option "scope" not set');
        }
        if (scope === 'all') {
            scope = getAllUserPermissions();
        }
        else if (typeof scope !== 'number') {
            scope = getUserPermissionsByName(scope);
        }
        debug$2('auth scope %s', scope);
        const params = new url.URLSearchParams({
            redirect_uri: CALLBACK_BLANK,
            response_type: 'token',
            display: 'page',
            v: this.options.apiVersion,
            client_id: clientId,
            scope: String(scope)
        });
        const url$1 = new url.URL(`https://oauth.vk.com/authorize?${params}`);
        return this.fetch(url$1, {
            method: 'GET'
        });
    }
    /**
     * Starts authorization
     */
    async run() {
        const { response } = await super.login();
        let { hash } = new url.URL(response.url);
        if (hash.startsWith('#')) {
            hash = hash.substring(1);
        }
        const params = new url.URLSearchParams(hash);
        if (params.has('error')) {
            throw new AuthorizationError({
                message: `Failed passed grant access: ${params.get('error_description') || 'Unknown error'}`,
                code: AUTHORIZATION_FAILED$2
            });
        }
        const userId = params.get('user_id');
        const expires = params.get('expires_in');
        return {
            email: params.get('email') || undefined,
            userId: userId !== null
                ? Number(userId)
                : undefined,
            token: params.get('access_token'),
            expires: expires !== null
                ? Number(expires)
                : undefined
        };
    }
}

const debug$1 = createDebug__default['default']('vk-io:authorization:implicit-flow-user');
const { AUTHORIZATION_FAILED: AUTHORIZATION_FAILED$1 } = exports.AuthErrorCode;
class ImplicitFlowGroups extends ImplicitFlow {
    /**
     * Constructor
     */
    constructor(options) {
        super(options);
        let { groupIds } = options;
        if (!Array.isArray(groupIds)) {
            groupIds = [groupIds];
        }
        this.groupIds = groupIds.map((rawGroupId) => {
            const groupId = Number(rawGroupId);
            return Math.abs(groupId);
        });
    }
    /**
     * Returns permission page
     */
    getPermissionsPage() {
        const { clientId } = this.options;
        let { scope } = this.options;
        if (scope === undefined) {
            throw new Error('Required option "scope" not set');
        }
        if (scope === 'all') {
            scope = getAllGroupPermissions();
        }
        else if (typeof scope !== 'number') {
            scope = getGroupPermissionsByName(scope);
        }
        debug$1('auth scope %s', scope);
        const params = new url.URLSearchParams({
            group_ids: this.groupIds.join(','),
            redirect_uri: CALLBACK_BLANK,
            response_type: 'token',
            display: 'page',
            v: this.options.apiVersion,
            client_id: clientId,
            scope: String(scope)
        });
        const url$1 = new url.URL(`https://oauth.vk.com/authorize?${params}`);
        return this.fetch(url$1, {
            method: 'GET'
        });
    }
    /**
     * Starts authorization
     */
    async run() {
        const { response } = await super.login();
        let { hash } = new url.URL(response.url);
        if (hash.startsWith('#')) {
            hash = hash.substring(1);
        }
        const params = new url.URLSearchParams(hash);
        if (params.has('error')) {
            throw new AuthorizationError({
                message: `Failed passed grant access: ${params.get('error_description') || 'Unknown error'}`,
                code: AUTHORIZATION_FAILED$1
            });
        }
        let expires = params.get('expires_in') || undefined;
        if (expires !== undefined) {
            expires = Number(expires);
        }
        const groups = [];
        for (const [name, value] of params) {
            if (!name.startsWith('access_token_')) {
                continue;
            }
            /* Example group access_token_XXXXX */
            const { 2: groupId } = name.split('_');
            groups.push({
                groupId: Number(groupId),
                token: value,
                expires: expires
            });
        }
        return { groups };
    }
}

const debug = createDebug__default['default']('vk-io:authorization:account-verification');
const { INVALID_PHONE_NUMBER, AUTHORIZATION_FAILED, FAILED_PASSED_CAPTCHA, FAILED_PASSED_TWO_FACTOR } = exports.AuthErrorCode;
/**
 * Two-factor auth check action
 */
const ACTION_AUTH_CODE = 'act=authcheck';
/**
 * Phone number check action
 */
const ACTION_SECURITY_CODE = 'act=security';
/**
 * Bind a phone to a page
 */
const ACTION_VALIDATE = 'act=validate';
/**
 * Bind a phone to a page action
 */
const ACTION_CAPTCHA = 'act=captcha';
/**
 * Number of two-factorial attempts
 */
const TWO_FACTOR_ATTEMPTS = 3;
class AccountVerification {
    /**
     * Constructor
     */
    constructor(options) {
        this.captchaAttempts = 0;
        this.twoFactorAttempts = 0;
        this.options = {
            timeout: 10000,
            ...options
        };
        this.jar = new toughCookie.CookieJar();
        this.fetchCookie = fetchCookieFollowRedirectsDecorator(this.jar);
        this.captchaValidate = undefined;
        this.captchaAttempts = 0;
        this.twoFactorValidate = undefined;
        this.twoFactorAttempts = 0;
    }
    /**
     * Returns custom tag
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    /**
     * Executes the HTTP request
     */
    fetch(url, options = {}) {
        const { agent, timeout } = this.options;
        const controller = new abortController.AbortController();
        const interval = setTimeout(() => controller.abort(), timeout);
        return this.fetchCookie(url, {
            ...options,
            headers: this.options.headers,
            agent,
            signal: controller.signal,
            compress: false
        }).finally(() => clearTimeout(interval));
    }
    /**
     * Runs authorization
     */
    async run(redirectUri) {
        let response = await this.fetch(redirectUri, {
            method: 'GET'
        });
        const isProcessed = true;
        while (isProcessed) {
            const { url: url$1 } = response;
            if (url$1.includes(CALLBACK_BLANK)) {
                let { hash } = new url.URL(response.url);
                if (hash.startsWith('#')) {
                    hash = hash.substring(1);
                }
                const params = new url.URLSearchParams(hash);
                if (params.has('error')) {
                    throw new AuthorizationError({
                        message: `Failed passed grant access: ${params.get('error_description') || 'Unknown error'}`,
                        code: AUTHORIZATION_FAILED
                    });
                }
                const userId = params.get('user_id');
                return {
                    userId: Number(userId),
                    token: params.get('access_token')
                };
            }
            const $ = cheerio.load(await response.text());
            if (url$1.includes(ACTION_AUTH_CODE)) {
                response = await this.processTwoFactorForm(response, $);
                continue;
            }
            if (url$1.includes(ACTION_SECURITY_CODE)) {
                response = await this.processSecurityForm(response, $);
                continue;
            }
            if (url$1.includes(ACTION_VALIDATE)) {
                response = await this.processValidateForm(response, $);
                continue;
            }
            if (url$1.includes(ACTION_CAPTCHA)) {
                response = await this.processCaptchaForm(response, $);
                continue;
            }
            throw new AuthorizationError({
                message: 'Account verification failed',
                code: AUTHORIZATION_FAILED
            });
        }
        throw new Error('Fallback error');
    }
    /**
     * Process two-factor form
     */
    async processTwoFactorForm(response, $) {
        debug('process two-factor handle');
        if (this.twoFactorValidate) {
            this.twoFactorValidate.reject(new AuthorizationError({
                message: 'Incorrect two-factor code',
                code: FAILED_PASSED_TWO_FACTOR,
                pageHtml: $.html()
            }));
            this.twoFactorAttempts += 1;
        }
        if (this.twoFactorAttempts >= TWO_FACTOR_ATTEMPTS) {
            throw new AuthorizationError({
                message: 'Failed passed two-factor authentication',
                code: FAILED_PASSED_TWO_FACTOR
            });
        }
        const { action, fields } = parseFormField($);
        const { code, validate } = await this.options.callbackService.processingTwoFactor({});
        fields.code = code;
        try {
            const url$1 = getFullURL(action, response);
            const newResponse = await this.fetch(url$1, {
                method: 'POST',
                body: new url.URLSearchParams(fields)
            });
            return newResponse;
        }
        catch (error) {
            validate.reject(error);
            throw error;
        }
    }
    /**
     * Process security form
     */
    async processSecurityForm(response, $) {
        debug('process security form');
        const { login, phone } = this.options;
        let number;
        if (phone !== undefined) {
            number = phone;
        }
        else if (login !== undefined && !login.includes('@')) {
            number = login;
        }
        else {
            throw new AuthorizationError({
                message: 'Missing phone number in the phone or login field',
                code: INVALID_PHONE_NUMBER
            });
        }
        if (typeof number === 'string') {
            number = number.trim().replace(/^(\+|00)/, '');
        }
        number = String(number);
        const $field = $('.field_prefix');
        const prefix = $field.first().text().trim().replace('+', '').length;
        const postfix = $field.last().text().trim().length;
        const { action, fields } = parseFormField($);
        fields.code = number.slice(prefix, number.length - postfix);
        const url$1 = getFullURL(action, response);
        const rewResponse = await this.fetch(url$1, {
            method: 'POST',
            body: new url.URLSearchParams(fields)
        });
        if (rewResponse.url.includes(ACTION_SECURITY_CODE)) {
            throw new AuthorizationError({
                message: 'Invalid phone number',
                code: INVALID_PHONE_NUMBER
            });
        }
        return rewResponse;
    }
    /**
     * Process validation form
     */
    processValidateForm(response, $) {
        const href = $('#activation_wrap a').attr('href');
        const url = getFullURL(href, response);
        return this.fetch(url, {
            method: 'GET'
        });
    }
    /**
     * Process captcha form
     */
    async processCaptchaForm(response, $) {
        if (this.captchaValidate !== undefined) {
            this.captchaValidate.reject(new AuthorizationError({
                message: 'Incorrect captcha code',
                code: FAILED_PASSED_CAPTCHA
            }));
            this.captchaValidate = undefined;
            this.captchaAttempts += 1;
        }
        const { action, fields } = parseFormField($);
        const src = $('.captcha_img').attr('src');
        if (!src) {
            throw new AuthorizationError({
                message: 'Failed get captcha image',
                code: AUTHORIZATION_FAILED
            });
        }
        const { key, validate } = await this.options.callbackService.processingCaptcha({
            type: vkIo.CaptchaType.ACCOUNT_VERIFICATION,
            sid: fields.captcha_sid,
            src
        });
        this.captchaValidate = validate;
        fields.captcha_key = key;
        const url$1 = getFullURL(action, response);
        url$1.searchParams.set('utf8', '1');
        const pageResponse = await this.fetch(url$1, {
            method: 'POST',
            body: new url.URLSearchParams(fields)
        });
        return pageResponse;
    }
}

const openAPIProperties = [
    'expire',
    'secret',
    'mid',
    'sid'
];
const userAuthorizedThroughOpenAPI = async ({ clientSecret, params }) => {
    let sign = [...openAPIProperties]
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('');
    sign += clientSecret;
    sign = crypto.createHash('md5')
        .update(sign)
        .digest('hex');
    const expire = Number(params.expire);
    const isExpired = Number.isNaN(expire) || expire < (Date.now() / 1000);
    const authorized = params.sig === sign && !isExpired;
    return { authorized };
};

exports.AccountVerification = AccountVerification;
exports.AuthorizationError = AuthorizationError;
exports.DirectAuthorization = DirectAuthorization;
exports.ImplicitFlow = ImplicitFlow;
exports.ImplicitFlowGroups = ImplicitFlowGroups;
exports.ImplicitFlowUser = ImplicitFlowUser;
exports.groupScopes = groupScopes;
exports.officialAppCredentials = officialAppCredentials;
exports.userAuthorizedThroughOpenAPI = userAuthorizedThroughOpenAPI;
exports.userScopes = userScopes;
