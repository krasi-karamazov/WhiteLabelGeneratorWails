import {Dropzone, FileWithPath} from "@mantine/dropzone";
import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import {IconUpload, IconX, IconFile} from '@tabler/icons-react';
import {useState} from "react";

export enum MimeType {
    json,
    zip
}

interface DropZoneProps {
    mimeType: MimeType
    normalText: string,
    onSelect: (file: FileWithPath) => void
}

function determineMimeType(mimeType: MimeType): string[] {
    switch (mimeType) {
        case MimeType.zip:
            return ["application/zip", "application/octet-stream", "application/x-zip-compressed", "multipart/x-zip"]
        case MimeType.json:
            return ["application/json"]
    }
}

export function DropArea({mimeType, normalText, onSelect}: DropZoneProps) {
    const theme = useMantineTheme();

    const [file, setFile] = useState<FileWithPath | null>(null)

    return (
        <div >
            <Dropzone
                onDrop={(files) => {
                    setFile(files[0])
                    onSelect(files[0])
                }}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={3 * 1024 ** 2}
                accept={determineMimeType(mimeType)}
            >
                <Group className={"drop-zone-container"} position="center" spacing="md" style={{ minHeight: rem(100), pointerEvents: 'none'}}>
                    <Dropzone.Accept>
                        <IconUpload
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors.green[theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconFile size="3.2rem" stroke={1.5} color={theme.colors["brand"][theme.colorScheme === 'dark' ? 4 : 6]}/>
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline color={theme.primaryColor}>
                            {(file != null)? file.name : normalText}
                        </Text>
                    </div>
                </Group>
            </Dropzone>
        </div>
    )
}