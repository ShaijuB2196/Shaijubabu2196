const URL = "my_model/"; // local folder containing model files
let recognizer;
let lastDetected = "";
let isListening = false;

async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    recognizer = speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
    await recognizer.ensureModelLoaded();
}

async function init() {
    document.getElementById("status").innerText = "Status: Loading Model...";
    if (!recognizer) await createModel();

    const classLabels = recognizer.wordLabels();

    recognizer.listen(result => {
        const scores = result.scores;
        const maxIndex = scores.indexOf(Math.max(...scores));
        const detectedClass = classLabels[maxIndex];

        if (detectedClass !== lastDetected && scores[maxIndex] > 0.75) {
            lastDetected = detectedClass;
            document.getElementById("label").innerText = "Detected Command: " + detectedClass;
        }
    }, {
        includeSpectrogram: false,
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: false,
        overlapFactor: 0.6
    });

    isListening = true;
    document.getElementById("status").innerText = "Status: Listening...";
}

function stop() {
    if (recognizer && isListening) {
        recognizer.stopListening();
        isListening = false;
        document.getElementById("status").innerText = "Status: Stopped";
    }
}
