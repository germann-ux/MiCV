// langSwitch.js
// Requiere que window.dict esté cargado antes (con claves: es, en, ...)

(() => {
    const STORAGE = "lang";

    // Helpers siempre frescos (por si el DOM cambia)
    const $t = () => document.querySelectorAll("[data-i18n]");
    const $aria = () => document.querySelectorAll("[data-i18n-aria-label]");
    const $ph = () => document.querySelectorAll("[data-i18n-placeholder]");
    const $ttl = () => document.querySelectorAll("[data-i18n-title]");
    const $btns = () => document.querySelectorAll(".lang-switch button");

    // Asigna texto respetando HTML embebido (<strong>, <br>, etc.)
    function setNode(el, value) {
        if (value == null) return;
        if (typeof value === "string" && value.includes("<")) el.innerHTML = value;
        else el.textContent = String(value);
    }

    function getPack(lang) {
        if (!window.dict) {
            console.warn("[i18n] dict no cargado aún.");
            return {};
        }
        return window.dict[lang] || window.dict.es || {};
    }

    // Exponer applyLang para que otros módulos puedan re-renderizar (Projects.js, etc.)
    window.applyLang = function (lang) {
        const pack = getPack(lang);

        // <html lang="..">
        document.documentElement.setAttribute("lang", lang);

        // <title> desde meta.title
        if (pack["meta.title"]) document.title = pack["meta.title"];

        // Contenido marcado
        $t().forEach(el => {
            const key = el.dataset.i18n;
            if (key in pack) setNode(el, pack[key]);
        });

        // Atributos comunes
        $aria().forEach(el => {
            const key = el.dataset.i18nAriaLabel;
            if (key in pack) el.setAttribute("aria-label", pack[key]);
        });
        $ph().forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (key in pack) el.setAttribute("placeholder", pack[key]);
        });
        $ttl().forEach(el => {
            const key = el.dataset.i18nTitle;
            if (key in pack) el.setAttribute("title", pack[key]);
        });

        // UI del switch
        $btns().forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));

        // Persistencia
        localStorage.setItem(STORAGE, lang);

        // Notifica a otros módulos
        document.dispatchEvent(new CustomEvent("langchange", { detail: { lang, dict: pack } }));
    };

    // Delegación de clicks para el switch (por si montas botones tarde)
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".lang-switch button");
        if (!btn) return;
        const lang = btn.dataset.lang;
        if (lang) window.applyLang(lang);
    });

    // Traduce nodos agregados dinámicamente con data-i18n / data-i18n-*
    const mo = new MutationObserver((mutations) => {
        const lang = localStorage.getItem(STORAGE) || "es";
        const pack = getPack(lang);

        const translateTree = (root) => {
            if (!(root instanceof Element)) return;

            // Nodo raíz
            if (root.hasAttribute?.("data-i18n")) {
                const key = root.getAttribute("data-i18n");
                if (key in pack) setNode(root, pack[key]);
            }
            if (root.hasAttribute?.("data-i18n-aria-label")) {
                const key = root.getAttribute("data-i18n-aria-label");
                if (key in pack) root.setAttribute("aria-label", pack[key]);
            }
            if (root.hasAttribute?.("data-i18n-placeholder")) {
                const key = root.getAttribute("data-i18n-placeholder");
                if (key in pack) root.setAttribute("placeholder", pack[key]);
            }
            if (root.hasAttribute?.("data-i18n-title")) {
                const key = root.getAttribute("data-i18n-title");
                if (key in pack) root.setAttribute("title", pack[key]);
            }

            // Descendientes
            root.querySelectorAll?.("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (key in pack) setNode(el, pack[key]);
            });
            root.querySelectorAll?.("[data-i18n-aria-label]").forEach(el => {
                const key = el.getAttribute("data-i18n-aria-label");
                if (key in pack) el.setAttribute("aria-label", pack[key]);
            });
            root.querySelectorAll?.("[data-i18n-placeholder]").forEach(el => {
                const key = el.getAttribute("data-i18n-placeholder");
                if (key in pack) el.setAttribute("placeholder", pack[key]);
            });
            root.querySelectorAll?.("[data-i18n-title]").forEach(el => {
                const key = el.getAttribute("data-i18n-title");
                if (key in pack) el.setAttribute("title", pack[key]);
            });
        };

        mutations.forEach(m => m.addedNodes.forEach(translateTree));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Resolver idioma inicial: ?lang > localStorage > navegador
    const params = new URLSearchParams(location.search);
    const urlLang = params.get("lang");
    const saved = localStorage.getItem(STORAGE);
    let initial = "es";

    if (urlLang && window.dict && window.dict[urlLang]) initial = urlLang;
    else if (saved && window.dict && window.dict[saved]) initial = saved;
    else if ((navigator.language || "").toLowerCase().startsWith("en")) initial = "en";

    // Aplicar al cargar
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => window.applyLang(initial));
    } else {
        window.applyLang(initial);
    }
})();
