declare module 'textarea-caret' {
    interface Coordinates {
        top: number;
        left: number;
        height: number;
    }
    function getCaretCoordinates(element: HTMLTextAreaElement, position: number): Coordinates;
    export = getCaretCoordinates;
}
