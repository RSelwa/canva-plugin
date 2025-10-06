import { AppI18nProvider } from "@canva/app-i18n-kit";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { App } from "./app";

const root = createRoot(document.getElementById("root") as Element);
function render() {
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </AppUiProvider>
    </AppI18nProvider>,
  );
}

render();

if (module.hot) {
  module.hot.accept("./app", render);
}
