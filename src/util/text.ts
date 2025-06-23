import * as path from "path";

export function getSeedDirectory(){
    return path.resolve(
        process.cwd(),
        "src",
        "seeds"
    )
}

export function getSeedFilePath(fileName:string | null) : string{
    if(fileName === null || fileName.trim() === ""){
        throw new Error("Missing fileName");
    }

    const seedDirectory = getSeedDirectory();
    return path.join(seedDirectory, fileName);
}