// noinspection DuplicatedCode

import {main} from "../../wailsjs/go/models";
import PropertiesData = main.PropertiesData;
import {useEffect, useRef, useState} from "react";
import {ActionIcon, Button, Card, ColorInput, ColorSwatch, Grid, Group, Space, Text, TextInput} from "@mantine/core";
import {modals} from "@mantine/modals";
import {IconTrash} from "@tabler/icons-react";

export interface ColorsEditProps{
    selectedData: PropertiesData
    stateChanger: (propsData: PropertiesData)=>void
}

export function ColorsEditScreen({selectedData, stateChanger}: ColorsEditProps) {

    const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(-1)
    const [selectedPropertyValue, setSelectedPropertyValue] = useState("")
    const [selectedPropertyKey, setSelectedPropertyKey] = useState("")
    const [selectedColorData, setSelectedColorData] = useState(null)
    const colorRef = useRef<HTMLInputElement>(null)
    const colorNameRef = useRef<HTMLInputElement>(null)

    const editProperty = (index: number)=> {
        modals.open({
            title: selectedPropertyKey,
            centered: true,
            onClose() {
                resetEditState()
            },
            children: (
                <>
                    <ColorInput value={selectedPropertyValue.trim()} onChange={(color: string) => setSelectedPropertyValue(color)}/>
                    <Group mt="xl" position={"right"}>
                        <Button onClick={()=> {
                            resetEditState()
                        }} >
                            Cancel
                        </Button>

                        <Button onClick={()=> {
                            selectedData.data[index] = selectedPropertyKey + "=" + selectedPropertyValue
                            stateChanger(selectedData)
                            resetEditState()
                        }} >
                            Submit
                        </Button>
                        <ActionIcon color={'red'} variant="filled" onClick={()=> {
                            const halfBeforeTheUnwantedElement = selectedData.data.slice(0, index)
                            const halfAfterTheUnwantedElement = selectedData.data.slice(index + 1, selectedData.data.length)
                            selectedData.data = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement)
                            stateChanger(selectedData)
                            resetEditState()
                        }}>
                            <IconTrash size="1.125rem" />
                        </ActionIcon>
                    </Group>
                </>

            ),
        })
    }

    const createProperty = () => {
        modals.open({
            title: 'Create color',
            centered: true,
            children: (
                <>
                    <TextInput ref={colorNameRef} label="Color name" placeholder="Color name" data-autofocus />
                    <Space h={16}/>
                    <ColorInput ref={colorRef} />
                    <Button fullWidth onClick={()=> {
                        // @ts-ignore
                        selectedData.data.push(colorNameRef.current.value + "=" + colorRef.current.value);
                        stateChanger(selectedData)
                        modals.closeAll()
                    }
                    } mt="md">
                        Submit
                    </Button>
                </>
            ),
        });
    }

    const resetEditState = () => {
        setSelectedPropertyValue("")
        setSelectedPropertyKey("")
        setSelectedPropertyIndex(-1)
        modals.closeAll()
    }

    useEffect(() => {
        if(selectedPropertyIndex != -1 && selectedPropertyValue.length > 0) {
            editProperty(selectedPropertyIndex)
        }
    },[selectedPropertyIndex, selectedPropertyValue])

    useEffect(() => {
        if(selectedData != null) {
            // @ts-ignore
            setSelectedColorData(selectedData)
        }
    }, [selectedData])

    return (
        <>
            <Button variant="filled" onClick={()=>{
                createProperty()
            }}>Add new</Button>
            <Space h={16}/>
            <Grid columns={3} className={"colors-grid"}>
                {
                    selectedData.data.map((value, index) => (
                        <Grid.Col span={1}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder key={index}>

                                <Group position="apart" mt="md" mb="xs">
                                    <Text truncate weight={500}>{value.split("=")[0]}</Text>
                                </Group>
                                <Group  mt="md" mb="xs">
                                    <ColorSwatch color={value.split("=")[1]}/>
                                    <Text truncate>
                                        {value.split("=")[1]}
                                    </Text>
                                </Group>
                                <Button fullWidth mt="md" radius="sm" onClick={()=>{
                                    setSelectedPropertyIndex(index)
                                    const colorParts = selectedData.data[index].split("=")
                                    setSelectedPropertyKey(colorParts[0])
                                    setSelectedPropertyValue(colorParts[1])
                                }}>
                                    Edit
                                </Button>
                            </Card>
                        </Grid.Col>
                    ))
                }
            </Grid>
        </>
    )
}