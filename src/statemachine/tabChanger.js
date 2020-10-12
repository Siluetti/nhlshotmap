export function handleTabChange(newValue, setStateFunction){
    setStateFunction({
        tabIndex: newValue,
    });
}