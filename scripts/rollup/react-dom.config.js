import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';
const { name, module, peerDependencies   } = getPackageJson('react-dom');
const pkgPath = resolvePkgPath(name);
const pkgDistPath = resolvePkgPath(name, true);
export default [
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'index.js',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd'
			}
		],
		external: [...Object.keys(peerDependencies)],
		plugins: [
			...getBaseRollupPlugins(),
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				input: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ description, version }) => ({
					name: 'react-dom',
					description,
					version,
					peerDependencies: {
						react: version
					},
					main: 'index.js'
				})
			})
		]
	}
];
