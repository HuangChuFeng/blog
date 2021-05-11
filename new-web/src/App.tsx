import { routes, RouteItem } from './routes';
import { environment } from '@environment/environment';
import { BrowserRouter as Router, Route } from 'react-router-dom';

console.log(environment);

function App(): JSX.Element {
  return (
    <Router>
      {routes.map((item: RouteItem, i: number) => {
        return <Route key={i} path={item.path} component={item.component} />;
      })}
    </Router>
  );
}

export default App;
