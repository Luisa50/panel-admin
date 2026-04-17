import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/principal.css";
import "../estilos/configuracion.css";
import { useTheme } from "../context/ThemeContext";
import {
  useLanguage,
  localeToUiLabel,
  getStoredLocale,
  UI_LABEL_ESPAÑOL,
  UI_LABEL_INGLES,
} from "../context/LanguageContext";
import { useFontSize } from "../context/FontSizeContext";
import { getAuth } from "../services/auth";

export default function Configuracion() {
  const { darkMode, toggleTheme } = useTheme();
  const { t, locale, setLocaleFromUiLabel } = useLanguage();
  const { fontSizeLabel, setFontSizeLabel } = useFontSize();

  const [mostrarModalCredenciales, setMostrarModalCredenciales] = useState(false);

  const [config, setConfig] = useState({
    idioma: localeToUiLabel(getStoredLocale()),
    fuente: fontSizeLabel,
    zona: "GMT-5",
    fecha: "DD/MM/AAAA",
    hora: "24",
    notificaciones: true,
    alertas: true,
    reportes: false,
  });

  useEffect(() => {
    setConfig((c) => ({ ...c, idioma: localeToUiLabel(locale) }));
  }, [locale]);

  useEffect(() => {
    setConfig((c) => ({ ...c, fuente: fontSizeLabel }));
  }, [fontSizeLabel]);

  const handleChange = (campo, valor) => {
    setConfig({ ...config, [campo]: valor });
  };

  const authSesion = getAuth();
  const correoSesion =
    authSesion?.correoPersonal?.trim() ? authSesion.correoPersonal.trim() : "";

  return (
    <div className="config-page">
      <header className="config-page__header">
        <h1 className="config-page__title">{t("config.title")}</h1>
        <p className="config-page__lead">{t("config.lead")}</p>
      </header>

      <section className="config-section" aria-labelledby="config-idioma">
        <h2 id="config-idioma" className="config-section__title">
          {t("config.langTitle")}
        </h2>
        <p className="config-section__desc">{t("config.langDesc")}</p>
        <div className="config-field">
          <label className="form-label" htmlFor="cfg-idioma">
            {t("config.langLabel")}
          </label>
          <select
            id="cfg-idioma"
            className="form-select"
            value={config.idioma}
            onChange={(e) => {
              const v = e.target.value;
              handleChange("idioma", v);
              setLocaleFromUiLabel(v);
            }}
          >
            <option value={UI_LABEL_ESPAÑOL}>{UI_LABEL_ESPAÑOL}</option>
            <option value={UI_LABEL_INGLES}>{UI_LABEL_INGLES}</option>
          </select>
        </div>
      </section>

      <section className="config-section" aria-labelledby="config-apariencia">
        <h2 id="config-apariencia" className="config-section__title">
          {t("config.appearanceTitle")}
        </h2>
        <p className="config-section__desc">{t("config.appearanceDesc")}</p>
        <div className="config-row config-row--2">
          <div className="config-field">
            <label className="form-label" htmlFor="cfg-tema">
              {t("config.theme")}
            </label>
            <select
              id="cfg-tema"
              className="form-select"
              value={darkMode ? "Oscuro" : "Claro"}
              onChange={(e) => {
                const valor = e.target.value;
                if (valor === "Oscuro" && !darkMode) {
                  toggleTheme();
                }
                if (valor === "Claro" && darkMode) {
                  toggleTheme();
                }
              }}
            >
              <option value="Claro">{t("config.themeLight")}</option>
              <option value="Oscuro">{t("config.themeDark")}</option>
            </select>
          </div>
          <div className="config-field">
            <label className="form-label" htmlFor="cfg-fuente">
              {t("config.fontSize")}
            </label>
            <select
              id="cfg-fuente"
              className="form-select"
              value={config.fuente}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("fuente", value);
                setFontSizeLabel(value);
              }}
            >
              <option value="Pequeña">{t("config.fontSmall")}</option>
              <option value="Normal">{t("config.fontNormal")}</option>
              <option value="Grande">{t("config.fontLarge")}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="config-section" aria-labelledby="config-regional">
        <h2 id="config-regional" className="config-section__title">
          {t("config.regionTitle")}
        </h2>
        <p className="config-section__desc">{t("config.regionDesc")}</p>
        <div className="config-field">
          <label className="form-label" htmlFor="cfg-zona">
            {t("config.timezone")}
          </label>
          <select
            id="cfg-zona"
            className="form-select"
            value={config.zona}
            onChange={(e) => handleChange("zona", e.target.value)}
          >
            <option value="GMT-5">{t("config.tzColombia")}</option>
            <option value="GMT-6">GMT-6</option>
            <option value="GMT-4">GMT-4</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div className="config-row config-row--2">
          <div className="config-field">
            <label className="form-label" htmlFor="cfg-fecha">
              {t("config.dateFormat")}
            </label>
            <select
              id="cfg-fecha"
              className="form-select"
              value={config.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
            >
              <option>DD/MM/AAAA</option>
              <option>MM/DD/AAAA</option>
            </select>
          </div>
          <div className="config-field">
            <label className="form-label" htmlFor="cfg-hora">
              {t("config.timeFormat")}
            </label>
            <select
              id="cfg-hora"
              className="form-select"
              value={config.hora}
              onChange={(e) => handleChange("hora", e.target.value)}
            >
              <option value="24">{t("config.hours24")}</option>
              <option value="12">{t("config.hours12")}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="config-section" aria-labelledby="config-notif">
        <h2 id="config-notif" className="config-section__title">
          {t("config.notifTitle")}
        </h2>
        <p className="config-section__desc">{t("config.notifDesc")}</p>
        <div className="config-toggle">
          <div className="config-toggle__text">
            <span className="config-toggle__label">
              {t("config.notifSystem")}
            </span>
            <span className="config-toggle__hint">
              {t("config.notifSystemHint")}
            </span>
          </div>
          <div className="form-check form-switch">
            <input
              id="cfg-notif-sistema"
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={config.notificaciones}
              onChange={(e) =>
                handleChange("notificaciones", e.target.checked)
              }
              aria-label={t("config.notifSystemAria")}
            />
          </div>
        </div>
        <div className="config-toggle">
          <div className="config-toggle__text">
            <span className="config-toggle__label">
              {t("config.notifAlerts")}
            </span>
            <span className="config-toggle__hint">
              {t("config.notifAlertsHint")}
            </span>
          </div>
          <div className="form-check form-switch">
            <input
              id="cfg-alertas"
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={config.alertas}
              onChange={(e) => handleChange("alertas", e.target.checked)}
              aria-label={t("config.notifAlertsAria")}
            />
          </div>
        </div>
        <div className="config-toggle">
          <div className="config-toggle__text">
            <span className="config-toggle__label">
              {t("config.notifWeekly")}
            </span>
            <span className="config-toggle__hint">
              {t("config.notifWeeklyHint")}
            </span>
          </div>
          <div className="form-check form-switch">
            <input
              id="cfg-reportes"
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={config.reportes}
              onChange={(e) => handleChange("reportes", e.target.checked)}
              aria-label={t("config.notifWeeklyAria")}
            />
          </div>
        </div>
      </section>

      <section className="config-section" aria-labelledby="config-seg">
        <h2 id="config-seg" className="config-section__title">
          {t("config.securityTitle")}
        </h2>
        <p className="config-section__desc">{t("config.securityDesc")}</p>
        <div className="config-actions">
          <button
            type="button"
            className="config-btn config-btn--primary"
            onClick={() => setMostrarModalCredenciales(true)}
          >
            {t("config.viewCredentials")}
          </button>
        </div>
      </section>

      {mostrarModalCredenciales && (
        <div
          className="config-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="config-modal-cred-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMostrarModalCredenciales(false);
          }}
        >
          <div className="config-modal-panel p-4">
            <h3 id="config-modal-cred-title" className="config-modal-panel__title">
              {t("config.credentialsModalTitle")}
            </h3>

            <div className="mb-3">
              <label className="form-label" htmlFor="cfg-cred-email">
                {t("config.credentialsEmailLabel")}
              </label>
              <p id="cfg-cred-email" className="config-credentials-value mb-0">
                {correoSesion || t("config.credentialsNoEmail")}
              </p>
            </div>

            <div className="mb-0">
              <span className="form-label d-block">{t("config.credentialsPasswordLabel")}</span>
              <p className="config-credentials-note mb-0">
                {t("config.credentialsPasswordNote")}
              </p>
            </div>

            <div className="config-modal-panel__footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMostrarModalCredenciales(false)}
              >
                {t("config.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
