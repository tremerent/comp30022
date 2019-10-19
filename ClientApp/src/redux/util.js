
export function flatCombineReducers(...reducers) {
    return reducers.reduce(
            (combined, reducer) =>
                (state, action) => reducer(combined(state, action), action)
        );
}

