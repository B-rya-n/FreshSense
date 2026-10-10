import { render } from "@testing-library/react";
import { I18nProvider } from "../traducoes/I18nContext";

export function renderWithProviders(ui, options) {
  return render(ui, {
    wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
    ...options,
  });
}
