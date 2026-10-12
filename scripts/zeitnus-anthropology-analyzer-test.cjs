#!/usr/bin/env node
/**
 * Zeitnus Anthropology Analyzer - Quick Test Script
 * Verifies the skill loads and can access required sources
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

const REQUIRED_SOURCES = [
  'openspec/specs/SPEC_INDEXER.md',
  'docs/CAOS_MODELONEGOCIO_ANALISIS.md',
  'docs/ALRAC_MASTER_INTEGRADO.md',
  'src/core/lib/loopEngine.ts',
  'src/core/lib/tq.ts',
  'docs/GRANALLIANZA_MAPPING.md',
  'skills/hscsg-orquestador-skills/SKILL.md',
  'skills/hscsg-unified-assimilation-science/SKILL.md',
];

console.log('🔍 Zeitnus Anthropology Analyzer — Quick Verification\n');

let allOk = true;

for (const src of REQUIRED_SOURCES) {
  const fullPath = path.join(ROOT, src);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${src}`);
  if (!exists) allOk = false;
}

// Check skill file
const skillPath = path.join(ROOT, 'skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md');
const skillExists = fs.existsSync(skillPath);
console.log(`${skillExists ? '✅' : '❌'} skills/hscsg-zeitnus-anthropology-analyzer/SKILL.md`);
if (!skillExists) allOk = false;

if (skillExists) {
  const skillContent = fs.readFileSync(skillPath, 'utf-8');
  const hasFrontmatter = skillContent.startsWith('---');
  const hasDescription = skillContent.includes('description:');
  const hasVersion = skillContent.includes('version:');
  const hasAuthor = skillContent.includes('author:');
  const hasPlatforms = skillContent.includes('platforms:');
  
  console.log('\n📋 Skill Frontmatter Validation:');
  console.log(`${hasFrontmatter ? '✅' : '❌'} Frontmatter starts with ---`);
  console.log(`${hasDescription ? '✅' : '❌'} Has description`);
  console.log(`${hasVersion ? '✅' : '❌'} Has version`);
  console.log(`${hasAuthor ? '✅' : '❌'} Has author`);
  console.log(`${hasPlatforms ? '✅' : '❌'} Has platforms`);
  
  // Check key sections
  const sections = [
    'When to Use',
    'Prerequisites',
    'How to Run',
    'Quick Reference',
    'Procedure',
    'Pitfalls',
    'Verification',
    'Crianza Evolutiva',
  ];
  
  console.log('\n📚 Skill Body Sections:');
  for (const section of sections) {
    const hasSection = skillContent.includes(`## ${section}`) || skillContent.includes(`### ${section}`);
    console.log(`${hasSection ? '✅' : '❌'} ${section}`);
  }
  
  // Check vasos comunicantes
  const vasos = ['[epist:humor]', '[epist:antropo]', '[epist:conduct]', '[alraico:loopEngine]', '[aut:CDS]', '[mon:ZNU]', '[canvas:20limites]'];
  console.log('\n🔗 Vasos Comunicantes References:');
  for (const vaso of vasos) {
    const hasVaso = skillContent.includes(vaso);
    console.log(`${hasVaso ? '✅' : '❌'} ${vaso}`);
  }
}

console.log('\n' + '='.repeat(50));
if (allOk) {
  console.log('✅ ALL CHECKS PASSED — Skill ready for use');
  process.exit(0);
} else {
  console.log('❌ SOME CHECKS FAILED — Review missing sources');
  process.exit(1);
}