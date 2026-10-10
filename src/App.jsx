import { Suspense, useEffect } from "react";
import { AppLayout } from "./componentes/AppLayout";
import { LoadingState } from "./componentes/LoadingState";
import { NaoEncontradaPage } from "./paginas/nao-encontrada/NaoEncontradaPage";
import { appRoutes, findRoute } from "./routes";
import { useRouter } from "./hooks/useRouter";

export default function App() {
  const location = useRouter();
  const path = location.pathname;
  const route = findRoute(path);
  const Page = route?.Component ?? NaoEncontradaPage;

  useEffect(() => {
    document.title = route
      ? `${route.title} | FreshSense`
      : "Página não encontrada | FreshSense";
  }, [route]);

  return (
    <AppLayout currentPath={path} routes={appRoutes}>
      <Suspense fallback={<LoadingState label={route?.label ?? "página"} />}>
        <Page />
      </Suspense>
    </AppLayout>
  );
}
