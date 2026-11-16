[Skip to content](https://github.com/Zentrik-AI/zentrik-open-crm/blob/main/cli/store.ts#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/Zentrik-AI/zentrik-open-crm/blob/main/cli/store.ts) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/Zentrik-AI/zentrik-open-crm/blob/main/cli/store.ts) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/Zentrik-AI/zentrik-open-crm/blob/main/cli/store.ts) to refresh your session.Dismiss alert

{{ message }}

## Collapse file tree

## Files

main

Search this repository(forward slash)` forward slash/`

/

# store.ts

Copy path

Blame

More file actions

Blame

More file actions

## Latest commit

Cannot retrieve latest commit at this time.

## History

[History](https://github.com/Zentrik-AI/zentrik-open-crm/commits/main/cli/store.ts)

[View commit history for this file.](https://github.com/Zentrik-AI/zentrik-open-crm/commits/main/cli/store.ts) History

302 lines (277 loc) · 13 KB

/

# store.ts

Copy path

Top

## File metadata and controls

- Code

- Blame


302 lines (277 loc) · 13 KB

[Raw](https://github.com/Zentrik-AI/zentrik-open-crm/raw/refs/heads/main/cli/store.ts)

Copy raw file

Download raw file

You must be signed in to make or propose changes

More edit options

Open symbols panel

Edit and raw actions

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

151

152

153

154

155

156

157

158

159

160

161

162

163

164

165

166

167

168

169

170

171

172

173

174

175

176

177

178

179

180

181

182

183

184

185

186

187

188

189

190

191

192

193

194

195

196

197

198

199

200

201

202

203

204

205

206

207

208

209

210

211

212

213

214

215

216

217

218

219

220

221

222

223

224

225

226

227

228

229

230

231

232

233

234

235

236

237

238

239

240

241

242

243

244

245

246

247

248

249

250

251

252

253

254

255

256

257

258

259

260

261

262

263

264

265

266

267

268

269

270

271

272

273

274

275

276

277

278

279

280

281

282

283

284

285

286

287

288

289

290

291

292

293

294

295

296

297

298

299

300

301

302

import{createHash,randomUUID}from"node:crypto";

importfsfrom"node:fs";

importpathfrom"node:path";

importtype{Workspace}from"../src/types.ts";

import{GENERATED\_NOTICE,buildViewFiles,workspaceLayout}from"../src/core/markdown.ts";

import{normalizeWorkspace,parseWorkspace,validateWorkspace}from"../src/core/validate.ts";

/\*\*

\\* A workspace folder on disk. \`workspace.json\` is the source of truth; the

\\* Markdown under \`accounts/\` and \`INDEX.md\` are views regenerated on every

\\* write. The app's local server, the \`crm\` command, and the MCP server all

\\* read and write through this module, one short lock at a time.

\*/

exportconstWORKSPACE\_FILE="workspace.json";

constSTATE\_DIR=".open-crm";

constLOCK\_FILE="lock";

constLOCK\_WAIT\_MS=3000;

exportclassStoreErrorextendsError{

code: string;

constructor(code: string,message: string){

super(message);

this.name="StoreError";

this.code=code;

}

}

/\\*\\* Walk up from \`start\` to the nearest folder holding a workspace.json. \*/

exportfunctionfindWorkspaceDir(start: string): string\|null{

letdir=path.resolve(start);

for(;;){

if(fs.existsSync(path.join(dir,WORKSPACE\_FILE)))returndir;

constparent=path.dirname(dir);

if(parent===dir)returnnull;

dir=parent;

}

}

exportfunctionresolveWorkspaceDir(explicit?: string): string{

constcandidate=explicit??process.env.OPEN\_CRM\_WORKSPACE;

if(candidate){

constdir=path.resolve(candidate);

if(!fs.existsSync(path.join(dir,WORKSPACE\_FILE))){

thrownewStoreError("no\_workspace",\`No ${WORKSPACE\_FILE} in ${dir}. Create one with: crm init ${candidate}\`);

}

returndir;

}

constfound=findWorkspaceDir(process.cwd());

if(!found)thrownewStoreError("no\_workspace",\`No workspace here. Create one with "crm init <folder>", or pass --workspace <folder>.\`);

returnfound;

}

constrevOf=(text: string)=>createHash("sha1").update(text).digest("hex").slice(0,12);

exportinterfaceLoaded{

workspace: Workspace;

/\\*\\* Content hash of workspace.json. Changes whenever anyone changes the file. \*/

rev: string;

}

exportfunctionreadWorkspace(dir: string): Loaded{

constfile=path.join(dir,WORKSPACE\_FILE);

lettext: string;

try{

text=fs.readFileSync(file,"utf8");

}catch{

thrownewStoreError("no\_workspace",\`Cannot read ${file}.\`);

}

const{ workspace, errors }=parseWorkspace(text);

if(!workspace){

thrownewStoreError("invalid\_workspace",\`${file} is not a valid workspace:\\n${errors.slice(0,12).map((e)=>\` \- ${e}\`).join("\\n")}\`);

}

return{ workspace,rev: revOf(text)};

}

functionwriteAtomic(file: string,content: string,beforeRename?: ()=>void){

consttmp=\`${file}.${process.pid}.${randomUUID()}.tmp\`;

try{

constfd=fs.openSync(tmp,"wx",0o600);

try{

fs.writeFileSync(fd,content);

fs.fsyncSync(fd);

}finally{

fs.closeSync(fd);

}

beforeRename?.();

fs.renameSync(tmp,file);

}finally{

fs.rmSync(tmp,{force: true});

}

}

functionsleep(ms: number){

Atomics.wait(newInt32Array(newSharedArrayBuffer(4)),0,0,ms);

}

functionprocessExists(pid: number): boolean{

try{

process.kill(pid,0);

returntrue;

}catch(error){

// EPERM and unknown errors are not proof that the owner has exited.

return(errorasNodeJS.ErrnoException).code!=="ESRCH";

}

}

functionreleaseLock(lock: string,owner: string){

// Never recursively remove a lock: a successor may already own this path.

try{fs.unlinkSync(path.join(lock,owner));}catch{/\\* already released \*/}

try{fs.rmdirSync(lock);}catch{/\\* absent or a non-empty successor \*/}

}

/\\*\\* A local-process lock, not a network/shared-drive lease. Publish a complete

\\* owner directory atomically, then reclaim only its exact dead-owner marker.

\\* An old mtime never grants permission to steal a live process's lock. \*/

exportfunctionwithWorkspaceLock<T>(dir: string,fn: ()=>T): T{

conststateDir=path.join(dir,STATE\_DIR);

fs.mkdirSync(stateDir,{recursive: true});

constlock=path.join(stateDir,LOCK\_FILE);

constowner=\`${process.pid}-${randomUUID()}.json\`;

constcandidate=fs.mkdtempSync(path.join(stateDir,"lock-candidate-"));

fs.writeFileSync(path.join(candidate,owner),JSON.stringify({pid: process.pid,token: owner}),{mode: 0o600});

constdeadline=Date.now()+LOCK\_WAIT\_MS;

try{

for(;;){

try{

fs.renameSync(candidate,lock);

break;

}catch(error){

if(!\["EEXIST","ENOTEMPTY","ENOTDIR","EISDIR","EPERM"\].includes((errorasNodeJS.ErrnoException).code??""))throwerror;

try{

constnames=fs.readdirSync(lock);

if(names.length===1&&/^\\d+-\[a-f0-9-\]+\\.json$/.test(names\[0\])){

constmarker=JSON.parse(fs.readFileSync(path.join(lock,names\[0\]),"utf8"));

if(Number.isSafeInteger(marker.pid)&&marker.pid>0&&marker.token===names\[0\]&&!processExists(marker.pid)){

releaseLock(lock,names\[0\]);

continue;

}

}elseif(names.length===0){

// A holder may have exited between unlinking its marker and rmdir.

try{fs.rmdirSync(lock);}catch{/\\* another contender acquired it \*/}

}

}catch{/\\* released, legacy, or unreadable; never guess ownership \*/}

if(Date.now()>deadline)thrownewStoreError("locked","Workspace lock is held or has unknown ownership. Retry after the writer exits. For a legacy or damaged lock, stop all CRM writers before removing .open-crm/lock.");

sleep(25);

}

}

try{returnfn();}finally{releaseLock(lock,owner);}

}finally{

releaseLock(candidate,owner);

}

}

functionserialize(workspace: Workspace){

return\`${JSON.stringify(workspace,null,2)}\\n\`;

}

functionreadGeneratedView(file: string): string\|null{

constcollision=(reason: string)=>newStoreError("view\_collision",\`Cannot generate ${file}: ${reason}. Move the existing path to a safe location, then retry. Its contents have not been replaced.\`);

letstat: fs.Stats;

try{

stat=fs.lstatSync(file);

}catch(error){

if((errorasNodeJS.ErrnoException).code==="ENOENT")returnnull;

throwcollision("the existing path cannot be inspected");

}

if(!stat.isFile())throwcollision("the existing path is not a regular generated file");

letcontent: string;

try{content=fs.readFileSync(file,"utf8");}

catch{throwcollision("the generated notice cannot be verified; check read permissions");}

// Keep accepting the original notice used by earlier workspace versions.

if(!content.includes(GENERATED\_NOTICE))throwcollision("the existing file has no Open CRM generated notice");

returncontent;

}

/\\*\\* Inspect every target before any canonical write, view write or orphan removal. \*/

functioncheckedViewFiles(dir: string,workspace: Workspace){

constfiles=buildViewFiles(workspace,workspaceLayout,true);

for(constfileoffiles)readGeneratedView(path.join(dir,file.path));

returnfiles;

}

/\\*\\* Rewrite marked Markdown views and remove marked account files whose account

\\* is gone. Refuse unmarked target files and leave unmarked orphans untouched. \*/

exportfunctionwriteViews(dir: string,workspace: Workspace){

constfiles=checkedViewFiles(dir,workspace);

constaccountDir=path.join(dir,workspaceLayout.accountDir);

fs.mkdirSync(accountDir,{recursive: true});

constkeep=newSet(files.map((file)=>path.join(dir,file.path)));

for(constentryoffs.readdirSync(accountDir,{withFileTypes: true})){

constfull=path.join(accountDir,entry.name);

if(!entry.isFile()\|\|!entry.name.endsWith(".md")\|\|keep.has(full))continue;

if(fs.readFileSync(full,"utf8").includes(GENERATED\_NOTICE))fs.rmSync(full);

}

for(constfileoffiles){

constfull=path.join(dir,file.path);

constcurrent=readGeneratedView(full);

if(current!==file.content)writeAtomic(full,file.content);

}

}

/\\*\\* Names of generated views that no longer match workspace.json. \*/

exportfunctionstaleViews(dir: string,workspace: Workspace): string\[\]{

returnbuildViewFiles(workspace,workspaceLayout,true)

.filter((file)=>{

try{

returnfs.readFileSync(path.join(dir,file.path),"utf8")!==file.content;

}catch{

returntrue;

}

})

.map((file)=>file.path);

}

exportfunctionwriteWorkspace(dir: string,workspace: Workspace): Loaded{

returncommitWorkspace(dir,workspace);

}

functioncommitWorkspace(dir: string,workspace: Workspace,beforeCommit?: ()=>void): Loaded{

consterrors=validateWorkspace(workspace);

if(errors.length)thrownewStoreError("invalid\_workspace",errors.slice(0,5).join(" "));

constnormalized=normalizeWorkspace(workspace);

consttext=serialize(normalized);

checkedViewFiles(dir,normalized);

writeAtomic(path.join(dir,WORKSPACE\_FILE),text,beforeCommit);

writeViews(dir,normalized);

return{workspace: normalized,rev: revOf(text)};

}

/\\*\\* Read, change, and write under one lock. \`fn\` returns the next workspace

\\* plus whatever the caller wants back. Throwing leaves the file untouched. \*/

exportfunctionupdateWorkspace<T>(dir: string,fn: (current: Loaded)=>{workspace: Workspace;result: T}): {loaded: Loaded;result: T}{

returnwithWorkspaceLock(dir,()=>{

const{ workspace, result }=fn(readWorkspace(dir));

return{loaded: writeWorkspace(dir,workspace), result };

});

}

exportclassRevisionConflictextendsStoreError{

current: Loaded;

constructor(current: Loaded){

super("conflict","The workspace changed on disk. Review the latest records before replacing them.");

this.current=current;

}

}

/\\*\\* Whole-workspace import/reset only. Ordinary operations use updateWorkspace.

\\* Missing or initially stale revisions fail before backup or mutation. A later

\\* conflict can leave a backup but does not commit the replacement. The immutable

\\* backup contains the exact previous file, including fields normalization would change. \*/

exportfunctionreplaceWorkspace(dir: string,workspace: Workspace,baseRev: string): Loaded&{backupPath: string}{

if(typeofbaseRev!=="string"\|\|!baseRev.trim())thrownewStoreError("base\_rev\_required","A baseRev from the last workspace read is required.");

consterrors=validateWorkspace(workspace);

if(errors.length)thrownewStoreError("invalid\_workspace",errors.slice(0,5).join(" "));

returnwithWorkspaceLock(dir,()=>{

constcurrent=readWorkspace(dir);

if(current.rev!==baseRev)thrownewRevisionConflict(current);

constprevious=fs.readFileSync(path.join(dir,WORKSPACE\_FILE),"utf8");

// Detect an editor write between the two reads too. Editors do not take our lock.

if(revOf(previous)!==baseRev)thrownewRevisionConflict(readWorkspace(dir));

constbackupDir=path.join(dir,STATE\_DIR,"backups");

fs.mkdirSync(backupDir,{recursive: true,mode: 0o700});

constbackupPath=path.join(backupDir,\`${baseRev}.json\`);

if(fs.existsSync(backupPath)){

if(fs.readFileSync(backupPath,"utf8")!==previous)thrownewStoreError("backup\_conflict","The existing revision backup differs. Replacement was stopped.");

}else{

writeAtomic(backupPath,previous);

}

constloaded=commitWorkspace(dir,workspace,()=>{

// Recheck after backup creation and staging, immediately before rename.

// This is not an OS atomic compare-and-swap: an arbitrary editor can still

// write between this read and rename without taking the workspace lock.

constlatest=readWorkspace(dir);

if(latest.rev!==baseRev)thrownewRevisionConflict(latest);

});

return{ ...loaded, backupPath };

});

}

/\\*\\* Restore one explicit backup, never guess 'latest'. This also backs up the

\\* current valid workspace and requires its current revision. \*/

exportfunctionrestoreWorkspace(dir: string,backupRev: string,baseRev: string): Loaded&{backupPath: string}{

if(typeofbaseRev!=="string"\|\|!baseRev.trim())thrownewStoreError("base\_rev\_required","A baseRev from the last workspace read is required.");

if(!/^\[a-f0-9\]{12}$/.test(backupRev))thrownewStoreError("bad\_request","Invalid backup revision.");

lettext: string;

try{text=fs.readFileSync(path.join(dir,STATE\_DIR,"backups",\`${backupRev}.json\`),"utf8");}

catch{thrownewStoreError("invalid\_backup","Cannot read the requested revision backup.");}

if(revOf(text)!==backupRev)thrownewStoreError("invalid\_backup","Backup content does not match its revision.");

const{ workspace, errors }=parseWorkspace(text);

if(!workspace)thrownewStoreError("invalid\_backup",errors.join(" "));

returnreplaceWorkspace(dir,workspace,baseRev);

}

/\\*\\* crm check --fix must reload under the write lock, not publish stale views. \*/

exportfunctionrepairViews(dir: string): Loaded{

returnwithWorkspaceLock(dir,()=>{

constloaded=readWorkspace(dir);

writeViews(dir,loaded.workspace);

returnloaded;

});

}

You can’t perform that action at this time.


While the code is focused, press Alt+F1 for a menu of operations.