import { Translated } from "../traducoes/I18nContext";

export function FormField({
  id,
  label,
  hint,
  error,
  children,
  full = false,
  className = "form-field",
  hintClassName = "field-hint",
  errorClassName = "field-error",
  alwaysRenderError = false,
}) {
  const hintId = hint ? `${id}-hint` : null;
  const errorId = alwaysRenderError || error ? `${id}-error` : null;
  const description = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control =
    typeof children === "function"
      ? children({ description, invalid: Boolean(error) })
      : children;

  return (
    <Translated>
      <div className={`${className}${full ? " full" : ""}`}>
        <label htmlFor={id}>{label}</label>
        {control}
        {hint && (
          <small className={hintClassName} id={hintId}>
            {hint}
          </small>
        )}
        {(alwaysRenderError || error) && (
          <small className={errorClassName} id={errorId} aria-live="polite">
            {error}
          </small>
        )}
      </div>
    </Translated>
  );
}

export function LotFormField(props) {
  return (
    <FormField
      {...props}
      className="lot-form-field"
      hintClassName="lot-field-hint"
      errorClassName="lot-field-error"
      alwaysRenderError
    />
  );
}

export function RiskFormField(props) {
  return <FormField {...props} className="risk-field" />;
}

export function SelectFormField({
  id,
  label,
  value,
  onChange,
  children,
  full = false,
}) {
  return (
    <FormField id={id} label={label} full={full}>
      <select id={id} name={id} value={value} onChange={onChange}>
        {children}
      </select>
    </FormField>
  );
}
