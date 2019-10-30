import React from 'react';

import CentreLoading from '../Shared/CentreLoading.js';

/**
 * Perhaps this should have a 'Switch' with 'Route's, but for now
 * there will be a seperate component for each /auth route - it may be
 * the case that we decide signup and login should be styled differently
 * - Jonah
 */

export default function AuthLayout(props) {
    const {
        loading,
        component: Component,
        componentProps,
    } = props;

    if (loading) {
        return <CentreLoading />;
    }
    else {
        return (
            <div className="af-auth-outer">
                <div className="af-auth-row">
                    <div className="af-auth-form">
                        <Component {...componentProps}/>
                    </div>
                </div>
            </div>
        );
    }
}
