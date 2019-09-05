import authService from '../components/api-authorization/AuthorizeService';

/*
 * All request functions assume parameters have already been validated.
 */

// assumes param. 'artefact' has been validated
async function postArtefact(artefact) {
    // post the artefact
    const token = await authService.getAccessToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    const response = await fetch('api/Artefacts', {
        method: 'POST',
        headers: !token ? { ...headers } : {
            ...headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(artefact),
    });

    return response.json();
}

// 'category' should already be validated
async function postCategory(category) {
    const token = await authService.getAccessToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await fetch('api/Categories', {
        method: 'POST',
        headers: !token ? { ...headers } : {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(category),
    });
    const respData = await response.json();

    return respData;
}

async function postArtefactCategories(artefactId, categories) {
    const token = await authService.getAccessToken();
    const headers = {
        'Content-Type': 'application/json'
    };

    const artefactCategories = categories
        .map(cat => ({ artefactId, categoryId: cat.id }));

    const response = await fetch('api/ArtefactCategories/Many', {
        method: 'POST',
        headers: !token ? { ...headers } : {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(artefactCategories),
    });
    const respData = await response.json();

    return respData;
}

async function getVisibilityOpts() {
    const token = await authService.getAccessToken();
    const response = await fetch('api/Artefacts/VisibilityOpts', {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const respData = await response.json();

    return respData;
}

async function getArtefacts() {
    const token = await authService.getAccessToken();
    const response = await fetch('api/Artefacts', {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const respData = await response.json();

    return respData;
}

export {
    postArtefact,
    postCategory,
    postArtefactCategories,
    getVisibilityOpts,
    getArtefacts,
}
