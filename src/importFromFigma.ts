import { Config } from "./config"
import { generateDSL } from "./dsl"
import { initializeLoader, loadRoot } from "./loader"
import { generateReactArtifacts } from "./react/react_generator"
import { clean } from "./resource"

async function importFromFigma(config: Config) {
    clean()

    initializeLoader(config);

    const { data } = await loadRoot()
    const { typography, colors, icons } = await generateDSL(data)

    switch (config.exportType) {
        case 'react':
            generateReactArtifacts(typography, colors, icons);
            break;
        case 'flutter':
            // TODO(lavinov): Implement Flutter generator
            // generateFlutterArtifacts(typography, colors, icons);
            break;
        default:
            throw new Error('Unexpected exportType');
    }

}

export { importFromFigma }