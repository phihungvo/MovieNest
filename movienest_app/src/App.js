import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import { publicRoutes } from './routes';

function App() {
  return (
    <Router>
    <div>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component
          let Layout = DashboardLayout

          return <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }>
          </Route>
        })}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
