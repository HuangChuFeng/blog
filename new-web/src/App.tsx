import { routes, RouteItem } from './routes';
import { environment } from '@environment/environment';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Nav from '@lib/Nav';

console.log(environment);

function App(): JSX.Element {
    return (
        <Router>
            <Nav />
            {routes.map((route: RouteItem, i: number) => {
                return <Route key={i} {...route} />;
            })}
        </Router>
    );
}

export default App;
