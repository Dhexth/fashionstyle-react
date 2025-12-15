import AppRouter from "./router/AppRouter";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <Layout>
      <AppRouter />
    </Layout>
  );
}
