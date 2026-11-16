(function (root) {
  'use strict';

  const APPLICATIONS = [
    { name: 'Calculator', appId: 'calculator', label: 'Calculator' },
    { name: 'Firefox', appId: 'firefox', label: 'Firefox' },
    { name: 'Google Chrome', appId: 'googleChrome', label: 'Google\nChrome' },
    { name: 'Microsoft Access (Windows only)', appId: 'microsoftAccess', label: 'Microsoft\nAccess' },
    { name: 'Microsoft Edge', appId: 'microsoftEdge', label: 'Microsoft\nEdge' },
    { name: 'Microsoft Excel', appId: 'microsoftExcel', label: 'Microsoft\nExcel' },
    { name: 'Microsoft OneNote', appId: 'microsoftOneNote', label: 'Microsoft\nOneNote' },
    { name: 'Microsoft Outlook', appId: 'microsoftOutlook', label: 'Microsoft\nOutlook' },
    { name: 'Microsoft PowerPoint', appId: 'microsoftPowerPoint', label: 'Microsoft\nPowerPoint' },
    { name: 'Microsoft Quick Assist (Windows only)', appId: 'microsoftQuickAssist', label: 'Quick\nAssist' },
    { name: 'Microsoft Teams', appId: 'microsoftTeams', label: 'Microsoft\nTeams' },
    { name: 'Microsoft Word', appId: 'microsoftWord', label: 'Microsoft\nWord' },
    { name: 'Opera', appId: 'opera', label: 'Opera' },
  ];
  function applicationByName(name) {
    return APPLICATIONS.find((app) => app.name === name) || null;
  }

  function applicationLabel(name) {
    const app = applicationByName(name);
    return app ? app.label : '';
  }

  function isCalendarDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof value === 'string' ? value : '');
    if (!match) return false;
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    return year >= 1 && daysInMonth !== undefined && day >= 1 && day <= daysInMonth;
  }

  function isShowDateAllowed(value, today) {
    return isCalendarDate(value) && value >= today;
  }

  function siteIdFrom(org, loc) {
    const clean = (s) => (s || '').replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
    const piece = (w) => {
      if (/^\d+$/.test(w)) return w;
      const a = w.toLowerCase().slice(0, 4);
      return a.charAt(0).toUpperCase() + a.slice(1);
    };
    const pieces = (str) => clean(str).split(/\s+/).filter(Boolean).map(piece).join('');
    let orgPart = pieces(org);
    orgPart = orgPart.charAt(0).toLowerCase() + orgPart.slice(1);
    const locPart = pieces(loc);
    return (orgPart + locPart).replace(/[^a-zA-Z0-9]/g, '');
  }

  function effectiveSiteId(s) {
    if (s.loadedSiteId && s.location === s.loadedLoc) return s.loadedSiteId;
    return siteIdFrom(s.orgName, s.location) || s.loadedSiteId || '';
  }

  function buildConfig(s) {
    const written = newConfig(s);
    return s.loadedFile ? savedOver(s, written) : written;
  }

  const SETTINGS = [
    { path: ['organizationName'], entries: ['orgName'] },
    { path: ['features', 'atUseCounter'], entries: ['measure'] },
    { path: ['features', 'autorunAfterLogin'], entries: ['autostart', 'scope'] },
    { path: ['features', 'checkForUpdates'], entries: ['checkForUpdates'] },
    { path: ['features', 'customMorphicBars'], entries: ['loadOwn'] },
    { path: ['features', 'resetSettings'], entries: ['resetOnSignout'] },
    { path: ['morphicBar', 'defaultLocation'], entries: ['position'] },
    { path: ['morphicBar', 'visibilityAfterLogin'], entries: ['visibility'] },
    { path: ['hideMorphicAfterLoginUntil'], entries: ['measure', 'showDate'] },
    { path: ['_builder', 'location'], entries: ['location'] },
  ];

  function getPath(object, path) {
    let value = object;
    for (const key of path) {
      if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, key)) return undefined;
      value = value[key];
    }
    return value;
  }

  function putPath(object, path, value) {
    let parent = object;
    for (const key of path.slice(0, -1)) {
      if (!parent[key] || typeof parent[key] !== 'object' || Array.isArray(parent[key])) {
        if (value === undefined) return;
        parent[key] = {};
      }
      parent = parent[key];
    }
    if (value === undefined) delete parent[path[path.length - 1]];
    else parent[path[path.length - 1]] = value;
  }

  function savedOver(s, written) {
    const out = copyOf(s.loadedFile);
    const was = s.loadedEntries || {};
    for (const setting of SETTINGS) {
      if (setting.entries.every((key) => s[key] === was[key])) continue;
      putPath(out, setting.path, getPath(written, setting.path));
    }
    if (effectiveSiteId(s) !== effectiveSiteId(was)) putPath(out, ['telemetry', 'siteId'], written.telemetry.siteId);
    const buttons = written.morphicBar.extraItems;
    if (buttons.length > 0 || getPath(s.loadedFile, ['morphicBar', 'extraItems']) !== undefined) {
      putPath(out, ['morphicBar', 'extraItems'], buttons);
    }
    if (out._builder && typeof out._builder === 'object') delete out._builder.contactEmail;
    return out;
  }

  function newConfig(s) {
    const scopeMap = { 'All local users': 'allLocalUsers', 'Current user only': 'currentUser' };
    const visMap = { 'Show': 'show', 'Hide': 'hide', 'Restore last state': 'restore' };
    const posMap = { 'Bottom right corner': 'bottomRight', 'Bottom left corner': 'bottomLeft', 'Top right corner': 'topRight', 'Top left corner': 'topLeft' };
    const cfg = {
      organizationName: s.orgName || '',
      features: {
        atUseCounter: { enabled: !!s.measure },
        autorunAfterLogin: { enabled: s.autostart, scope: scopeMap[s.scope] || 'allLocalUsers' },
        checkForUpdates: { enabled: s.checkForUpdates },
        customMorphicBars: { enabled: s.loadOwn },
        resetSettings: { enabled: s.resetOnSignout },
      },
      morphicBar: {
        defaultLocation: posMap[s.position] || 'bottomRight',
        extraItems: s.buttons.map((b) => {
          if (b.original && (b.kind !== 'app' || (applicationByName(b.app) || {}).appId === b.original.appId)) return copyOf(b.original);
          if (b.kind === 'usb') return { type: 'control', feature: 'usbopeneject' };
          if (b.kind === 'volume') return { type: 'control', feature: 'volume' };
          if (b.kind === 'voice') return { type: 'control', feature: 'voice' };
          if (b.kind === 'signout') return { type: 'action', feature: 'signout', label: 'Sign\nOut', tooltipHeader: 'Sign Out', tooltipText: 'Sign out of this computer', function: 'signOut' };
          if (b.kind === 'app') {
            const app = applicationByName(b.app);
            return { type: 'application', label: app ? app.label : '', appId: app ? app.appId : '' };
          }
          if (b.kind === 'url') {
            const link = { type: 'link', label: b.label || '' };
            if ((b.tipHeader || '').trim()) link.tooltipHeader = b.tipHeader;
            if ((b.tipDesc || '').trim()) link.tooltipText = b.tipDesc;
            link.url = (b.url || '').trim();
            return link;
          }
          return null;
        }).filter(Boolean),
        visibilityAfterLogin: visMap[s.visibility] || 'show',
      },
      telemetry: { siteId: effectiveSiteId(s) },
      _builder: { location: s.location || 'main' },
      version: 0,
    };
    if (s.measure && isCalendarDate(s.showDate)) cfg.hideMorphicAfterLoginUntil = s.showDate;
    return cfg;
  }

  function readConfig(raw, defaultShowDate) {
    const { file: cfg, removed } = cleanFile(raw);
    const b = isSection(cfg._builder) ? cfg._builder : {};
    const feat = cfg.features || {};
    const bar = cfg.morphicBar || {};
    const auto = feat.autorunAfterLogin || {};
    const scopeMap = { allLocalUsers: 'All local users', currentUser: 'Current user only' };
    const visMap = { show: 'Show', hide: 'Hide', restore: 'Restore last state' };
    const posMapIn = { bottomRight: 'Bottom right corner', bottomTrailing: 'Bottom right corner', bottomLeft: 'Bottom left corner', bottomLeading: 'Bottom left corner', topRight: 'Top right corner', topTrailing: 'Top right corner', topLeft: 'Top left corner', topLeading: 'Top left corner' };
    const isoDate = (c) => (c && /^\d{8}$/.test(c)) ? c.slice(0, 4) + '-' + c.slice(4, 6) + '-' + c.slice(6, 8) : (c || '');
    const items = bar.extraItems || [];
    const loadNotes = { invalid: removed, leftOut: 0, updated: 0 };
    const buttons = [];
    let seq = 1;
    for (const it of items) {
      const read = readButton(it);
      if (!read.button || buttons.length === 3) { loadNotes.leftOut += 1; continue; }
      if (read.updated) loadNotes.updated += 1;
      buttons.push(Object.assign({ id: seq++ }, read.button));
    }
    const hideUntil = cfg.hideMorphicAfterLoginUntil;
    const measure = typeof hideUntil === 'string';
    const loadedDate = isoDate(hideUntil);
    const showDate = measure ? (isCalendarDate(loadedDate) ? loadedDate : '') : defaultShowDate;
    if (measure && !isCalendarDate(loadedDate)) loadNotes.dateUnreadable = true;
    const location = typeof b.location === 'string' ? b.location : '';
    return {
      orgName: cfg.organizationName || '',
      location,
      email: '',
      loadedSiteId: (cfg.telemetry && cfg.telemetry.siteId) || '',
      loadedOrg: cfg.organizationName || '',
      loadedLoc: location,
      measure,
      showDate,
      autostart: auto.enabled !== false,
      scope: ownValue(scopeMap, auto.scope) || 'All local users',
      checkForUpdates: feat.checkForUpdates ? feat.checkForUpdates.enabled === true : false,
      loadOwn: feat.customMorphicBars ? feat.customMorphicBars.enabled !== false : true,
      visibility: ownValue(visMap, bar.visibilityAfterLogin) || 'Show',
      position: ownValue(posMapIn, bar.defaultLocation) || 'Bottom right corner',
      resetOnSignout: feat.resetSettings ? feat.resetSettings.enabled === true : false,
      buttons, seq, loadNotes, loadedFile: cfg,
    };
  }

  const copyOf = (value) => JSON.parse(JSON.stringify(value));
  const ownValue = (map, key) => (typeof key === 'string' && Object.prototype.hasOwnProperty.call(map, key)) ? map[key] : undefined;
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const isSection = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

  const FEATURES = ['atOnDemand', 'atUseCounter', 'autorunAfterLogin', 'checkForUpdates', 'cloudSettingsTransfer',
    'customMorphicBars', 'osSettingsLinks', 'resetSettings', 'signIn'];
  const LOCATIONS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'topLeading', 'topTrailing', 'bottomLeading', 'bottomTrailing'];

  function withScheme(text) {
    const typed = String(text).replace(/^\s+/, '');
    const lower = typed.toLowerCase();
    if (typed === '' || 'https://'.startsWith(lower) || 'http://'.startsWith(lower)) return typed;
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(typed) || /^(javascript|data|vbscript|file|mailto|tel|skype):/i.test(typed)) return typed;
    return 'https://' + typed.replace(/^\/+/, '');
  }

  function webAddressProblem(text) {
    const trimmed = String(text || '').trim();
    if (trimmed === '' || /^https?:\/\/$/i.test(trimmed)) return 'empty';
    let url;
    try { url = new URL(trimmed); } catch (_) { return 'invalid'; }
    if (!/^https?:$/.test(url.protocol) || !url.hostname) return 'invalid';
    if (url.username || url.password) return 'credentials';
    return '';
  }

  function looksLikeConfig(value) {
    const keys = ['version', 'features', 'morphicBar', 'telemetry', 'hideMorphicAfterLoginUntil', 'organizationName', '_builder'];
    return isSection(value) && keys.some((key) => has(value, key));
  }

  function cleanFile(raw) {
    const file = copyOf(raw);
    let removed = 0;
    const drop = (parent, key) => { delete parent[key]; removed += 1; };
    const present = (parent, key) => has(parent, key) && parent[key] !== null;
    const checkText = (parent, key, allowed) => {
      if (present(parent, key) && (typeof parent[key] !== 'string' || (allowed && !allowed.includes(parent[key])))) drop(parent, key);
    };
    const checkSection = (parent, key) => {
      if (!present(parent, key)) return false;
      if (!isSection(parent[key])) { drop(parent, key); return false; }
      return true;
    };
    if (file.version !== 0) file.version = 0;
    checkText(file, 'organizationName');
    if (present(file, 'hideMorphicAfterLoginUntil') && typeof file.hideMorphicAfterLoginUntil !== 'string') file.hideMorphicAfterLoginUntil = '';
    if (checkSection(file, 'features')) {
      for (const name of FEATURES) {
        if (!checkSection(file.features, name)) continue;
        const feature = file.features[name];
        if (present(feature, 'enabled') && typeof feature.enabled !== 'boolean') drop(feature, 'enabled');
        checkText(feature, 'scope', name === 'autorunAfterLogin' ? ['allLocalUsers', 'currentUser'] : null);
      }
    }
    if (checkSection(file, 'morphicBar')) {
      checkText(file.morphicBar, 'defaultLocation', LOCATIONS);
      checkText(file.morphicBar, 'visibilityAfterLogin', ['restore', 'show', 'hide']);
      if (present(file.morphicBar, 'extraItems') && !Array.isArray(file.morphicBar.extraItems)) drop(file.morphicBar, 'extraItems');
    }
    if (checkSection(file, 'telemetry')) checkText(file.telemetry, 'siteId');
    return { file, removed };
  }

  function readButton(it) {
    if (!isSection(it)) return {};
    const textKeys = ['type', 'label', 'tooltipHeader', 'tooltipText', 'url', 'function', 'feature', 'appId'];
    if (textKeys.some((key) => it[key] !== undefined && it[key] !== null && typeof it[key] !== 'string')) return {};
    const hasLabel = typeof it.label === 'string';
    const app = (name) => ({ kind: 'app', app: name, tooltip: '' });
    switch (it.type) {
      case 'link':
        return { button: { kind: 'url', label: it.label || '', url: it.url || 'https://', tipHeader: it.tooltipHeader || '', tipDesc: it.tooltipText || '' } };
      case 'action': {
        if (typeof it.function !== 'string' || it.function === '') return {};
        const isSignOut = it.function.toLowerCase() === 'signout';
        if (!hasLabel) return isSignOut ? { button: { kind: 'signout' }, updated: true } : {};
        return { button: { kind: isSignOut ? 'signout' : 'kept', original: copyOf(it) } };
      }
      case 'control': {
        if (typeof it.feature !== 'string' || it.feature === '') return {};
        const kind = ownValue({ usbopeneject: 'usb', volume: 'volume', voice: 'voice' }, it.feature);
        return { button: { kind: kind || 'kept', original: copyOf(it) } };
      }
      case 'application': {
        const listed = APPLICATIONS.find((known) => known.appId === it.appId);
        if (!listed) return {};
        return hasLabel ? { button: Object.assign(app(listed.name), { original: copyOf(it) }) } : { button: app(listed.name), updated: true };
      }
      default:
        return {};
    }
  }

  function keptButtonLabel(item) {
    return (item && (item.label || item.function || item.feature)) || '';
  }

  const api = {
    APPLICATIONS, applicationLabel, keptButtonLabel, isCalendarDate, isShowDateAllowed, looksLikeConfig,
    withScheme, webAddressProblem,
    siteIdFrom, effectiveSiteId, buildConfig, readConfig,
  };
  if (typeof module === 'object' && module && module.exports) {
    module.exports = api;
  } else {
    root.MorphicConfigFile = api;
  }
})(globalThis);
