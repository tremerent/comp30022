import React from 'react';

import CentreLoading from '../CenterLoading.js';

/**
 * Perhaps this should have a 'Switch' with 'Route's, but for now
 * there will be a seperate component for each /auth route - it may be
 * the case that we decide signup and login should be styled differently
 * - Jonah
 */

export default function AuthLayout(props) {
    const { loading, component: Component } = props;

    if (loading) {
        return <CentreLoading />;
    }
    else {
        return (
            <div className="af-auth-outer">
                <div className="af-auth-row">
                    <div className="af-auth-form">
                        <Component />
                    </div>
                </div>
            </div>
        );

        // terrible banner thing
        //    /*.af-auth-row {
        //margin-top: 5vh;

        //display: flex;
        //flex-direction: row;
        //}*/
        //return (
        //    <div className="af-auth-outer">
        //        <div className="af-auth-row">
        //            <div className="af-auth-form">
        //                <Component />
        //            </div>
        //            <div className="af-auth-decoration">
        //                <div className="af-auth-decoration-outer">
        //                    <div className="af-auth-decoration-box box-shadow">
        //                        <div className="af-auth-outer-brand">
        //                            <img src={ARTEFACTOR_BRAND} className="af-auth-brand" />
        //                        </div>
        //                    </div>
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //);
    }
}
