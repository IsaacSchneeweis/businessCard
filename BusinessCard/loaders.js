
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";


async function loadModels(modelPath, modelName) {
    var modelName;
    const loader = new GLTFLoader();
    modelName =  loader.loadAsync(modelPath);
    return modelName;
   // console.log(modelName, "hey");

}

export {loadModels};