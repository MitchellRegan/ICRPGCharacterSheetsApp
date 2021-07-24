import * as Font from 'expo-font';

const FontLoader = {
	loadAllFonts: async function () {
		await Font.loadAsync(fontsToLoad);
	}
}

const fontsToLoad = {
	'ComicNeue-Bold': require('../../assets/fonts/ComicNeue-Bold.ttf'),
	'TitanOne-Regular': require('../../assets/fonts/TitanOne-Regular.ttf'),
}

export default FontLoader;