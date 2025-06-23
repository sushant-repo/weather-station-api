import * as path from "path";

export function getSeedFilePath(fileName:string | null) : string{
    if(fileName === null || fileName.trim() === ""){
        throw new Error("Missing fileName");
    }

    return path.resolve(
        process.cwd(),
        "src",
        "seeds",
        fileName
    )
}