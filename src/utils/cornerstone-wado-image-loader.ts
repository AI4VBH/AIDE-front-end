import dicomParser from "dicom-parser";
import * as cornerstone from "@cornerstonejs/core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

export default function initCornerstoneWADOImageLoader(token?: string) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneWADOImageLoader.configure({
        useWebWorkers: true,
        decodeConfig: {
            convertFloatPixelDataToInt: false,
        },
    });

    if (token) {
        cornerstoneWADOImageLoader.configure({
            beforeSend: (xhr: XMLHttpRequest) => {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            },
        });
    }

    let maxWebWorkers = 1;

    if (navigator.hardwareConcurrency) {
        maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
    }

    const config = {
        maxWebWorkers,
        startWebWorkersOnDemand: false,
        taskConfiguration: {
            decodeTask: {
                initializeCodecsOnStartup: false,
                strict: false,
            },
        },
    };

    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
}
