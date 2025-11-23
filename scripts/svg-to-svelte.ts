/**
 * scripts/svg-to-svelte.ts
 *
 * Converts .svg files in `src/lib/icons/svg/` to Svelte components in
 * `src/lib/icons/components/` and writes an index.ts re-export file.
 *
 * Usage:
 *   npm run icons:build
 *
 * Requires dev dependencies: fast-glob, svgo, prettier (optional)
 */

import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import { optimize } from 'svgo';

const SRC_SVG_DIR = path.resolve(process.cwd(), 'src/lib/icons/svg');
const OUT_COMPONENT_DIR = path.resolve(process.cwd(), 'src/lib/icons/components');
const OUT_INDEX_FILE = path.resolve(process.cwd(), 'src/lib/icons/index.ts');

function toPascalCase(name: string): string {
	return name
		.replace(/(^\w|[-_ ]\w)/g, (m) => m.replace(/[-_ ]/, '').toUpperCase())
		.replace(/\.svg$/i, '');
}

function normalizeSvg(svg: string): string {
	let content = svg;

	// Remove width and height attributes (so sizing is controlled by props)
	content = content.replace(/\s(?:width|height)="[^"]*"/gi, '');

	// Replace fill="somecolor" (not none/currentColor/gradient) with currentColor
	// This is a simple heuristic: we avoid replacing when fill contains 'url(' (gradients) or 'none' or 'currentColor'
	content = content.replace(
		/\sfill="(?!none|transparent|currentColor|url\()[^"]+"/gi,
		' fill="currentColor"'
	);

	// Same for stroke
	content = content.replace(
		/\sstroke="(?!none|currentColor|url\()[^"]+"/gi,
		' stroke="currentColor"'
	);

	return content;
}

async function ensureDir(dir: string) {
	try {
		await fs.mkdir(dir, { recursive: true });
	} catch {
		// ignore if exists
	}
}

async function fileExists(p: string): Promise<boolean> {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

async function main(): Promise<void> {
	if (!(await fileExists(SRC_SVG_DIR))) {
		console.error(`Source SVG directory not found: ${SRC_SVG_DIR}`);
		process.exit(1);
	}

	await ensureDir(OUT_COMPONENT_DIR);

	const svgPaths = await fg('**/*.svg', { cwd: SRC_SVG_DIR, absolute: true });

	if (!svgPaths.length) {
		console.log('No SVG files found in', SRC_SVG_DIR);
		return;
	}

	type ExportInfo = { name: string; file: string };
	const exportsArr: ExportInfo[] = [];

	for (const filePath of svgPaths) {
		try {
			const raw = String(await fs.readFile(filePath, 'utf8'));
			// Optimize with SVGO
			const res = optimize(raw);

			if ('error' in res && res.error) {
				console.error('SVGO error for', filePath, res.error);
				continue;
			}

			const normalized = normalizeSvg(res.data);

			// Extract inner contents of <svg> and attributes (like viewBox)
			const svgTagMatch = normalized.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
			if (!svgTagMatch) {
				console.warn('Skipping (no svg tag found):', filePath);
				continue;
			}

			const svgAttrs = svgTagMatch[1];
			const inner = svgTagMatch[2].trim();

			const vbMatch = svgAttrs.match(/\bviewBox="([^"]+)"/i);
			const viewBox = vbMatch ? vbMatch[1] : '0 0 24 24';

			const baseName = path.basename(filePath, '.svg');
			const componentName = toPascalCase(baseName);
			const componentFilePath = path.join(OUT_COMPONENT_DIR, `${componentName}.svelte`);

			// Svelte component template (TypeScript)
			const componentSource = `
<script lang="ts">
  let {size=24, className='', ...rest} = $props()
</script>

<svg
  {...rest}
  class={className}
  width={size}
  height={size}
  viewBox="${viewBox}"
  fill="none"
>
  ${inner}
</svg>
`.trim();

			await fs.writeFile(componentFilePath, componentSource, 'utf8');
			console.log('Wrote', componentFilePath);

			exportsArr.push({ name: componentName, file: `./components/${componentName}.svelte` });
		} catch (err) {
			console.error('Error processing', filePath, err);
		}
	}

	const finalIndex =
		exportsArr.map((e) => `export { default as ${e.name} } from '${e.file}';`).join('\n') + '\n';
	await fs.writeFile(OUT_INDEX_FILE, finalIndex, 'utf8');
	console.log('Wrote', OUT_INDEX_FILE);
	console.log('Done — generated', exportsArr.length, 'components.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
