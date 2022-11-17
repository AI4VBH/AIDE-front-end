import { getEnabledElement } from "@cornerstonejs/core";
import { BaseTool, Types as ToolTypes } from "@cornerstonejs/tools";

/**
 * Tool that rotates the camera in the plane defined by the viewPlaneNormal and the viewUp.
 */
export class RotateTool extends BaseTool {
    static toolName: string;
    touchDragCallback: (evt: ToolTypes.EventTypes.MouseDragEventType) => void;
    mouseDragCallback: (evt: ToolTypes.EventTypes.MouseDragEventType) => void;

    constructor(
        toolProps: ToolTypes.PublicToolProps = {},
        defaultToolProps: ToolTypes.ToolProps = {
            supportedInteractionTypes: ["Mouse", "Touch"],
            configuration: {
                rotateIncrementDegrees: 5,
            },
        },
    ) {
        super(toolProps, defaultToolProps);

        this.touchDragCallback = this._dragCallback.bind(this);
        this.mouseDragCallback = this._dragCallback.bind(this);
    }

    _dragCallback(evt: ToolTypes.EventTypes.MouseDragEventType): void {
        const { element, currentPoints, lastPoints } = evt.detail;
        const currentPointsCanvas = currentPoints.canvas;
        const lastPointsCanvas = lastPoints.canvas;
        const { rotateIncrementDegrees } = this.configuration;
        const enabledElement = getEnabledElement(element);

        if (!enabledElement) {
            return;
        }

        const direction = currentPointsCanvas[0] - lastPointsCanvas[0];

        if (direction === 0) {
            return;
        }

        const { viewport } = enabledElement;
        const props = viewport.getProperties();

        if (direction > 0) {
            viewport.setProperties({ rotation: props.rotation + rotateIncrementDegrees });
        } else if (direction < 0) {
            viewport.setProperties({ rotation: props.rotation - rotateIncrementDegrees });
        }

        viewport.render();
    }
}

RotateTool.toolName = "Rotate";
export default RotateTool;
