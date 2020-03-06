import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { Route, Link as RouterLink, } from "react-router-dom"

const LinkRouter = props => <Link {...props} component={RouterLink} />;

export function BreadCrumbsRouted() {
    return (
        <Route>
            {({ location }) => {
                const pathnames = location.pathname.split('/').filter(x => x);
                console.log(pathnames)
                return (
                    <Breadcrumbs aria-label="breadcrumb">
                        <LinkRouter color="inherit" to="/">Home</LinkRouter>
                        {pathnames.map((value, index) => {
                            const last = index === pathnames.length - 1;
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                            return last ? (
                                <Typography color="textPrimary" key={to}>
                                    {value}
                                </Typography>

                            ) : (<LinkRouter color="inherit" to={to} key={to}>
                                        {value}
                                    </LinkRouter>);
                        })}
                    </Breadcrumbs>
                );
            }}
        </Route>)
}