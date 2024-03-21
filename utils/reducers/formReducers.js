export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true
            };
        // Add other cases as needed
        default:
            const { validationResult, inputId, inputValue } = action;

            const updatedValues = {
                ...state.inputValues,
                [inputId]: inputValue,
            };

            const updatedValidities = {
                ...state.inputValidities,
                [inputId]: validationResult,
            };

            let updatedFormIsValid = true;

            for (const key in updatedValidities) {
                if (updatedValidities[key] !== undefined) {
                    updatedFormIsValid = false;
                    break;
                }
            }

            return {
                inputValues: updatedValues,
                inputValidities: updatedValidities,
                formIsValid: updatedFormIsValid,
                isAuthenticated: state.isAuthenticated // Preserve previous authentication state
            };
    }

    // const { validationResult, inputId, inputValue } = action

    // const updatedValues = {
    //     ...state.inputValues,
    //     [inputId]: inputValue,
    // }

    // const updatedValidities = {
    //     ...state.inputValidities,
    //     [inputId]: validationResult,
    // }

    // let updatedFormIsValid = true

    // for (const key in updatedValidities) {
    //     if (updatedValidities[key] !== undefined) {
    //         updatedFormIsValid = false
    //         break
    //     }
    // }

    // return {
    //     inputValues: updatedValues,
    //     inputValidities: updatedValidities,
    //     formIsValid: updatedFormIsValid,
    //     isAuthenticated: state.isAuthenticated
    // }
}