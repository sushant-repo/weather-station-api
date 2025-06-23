import { Test, TestingModule } from '@nestjs/testing';
import { getSeedFilePath } from './text';
import * as path from 'path';

describe("getSeedFilePath", () => {
    it("should throw error when fileName is missing", () => {
        let fileName : string | null = "";
        expect(() => getSeedFilePath(fileName)).toThrow("Missing fileName");

        fileName = null;
        expect(() => getSeedFilePath(fileName)).toThrow("Missing fileName");
    });

    it("should return correct file path **/src/seeds/*.csv", () => {
        const fileName = "Hello.csv";

        const filePath = getSeedFilePath(fileName);
        const pathPattern = new RegExp(`[/\\\\]src[/\\\\]seeds[/\\\\]${fileName}$`);

        expect(path.isAbsolute(filePath)).toBe(true);
        expect(filePath).toMatch(pathPattern);
    })
})