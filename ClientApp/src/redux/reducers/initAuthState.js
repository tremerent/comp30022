import { getCurUser } from '../../scripts/auth';

export default function getInitAuthState() {
    const loggedInUser = getCurUser();

    const initAuthState = {
        user: {},
        isLoggedIn: false,
        loading: false,
    };

    if (loggedInUser != null) {
        initAuthState.user = loggedInUser;
        initAuthState.isLoggedIn = true;
    }

    return initAuthState;
}
