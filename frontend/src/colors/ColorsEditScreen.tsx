// noinspection DuplicatedCode

import {main} from "../../wailsjs/go/models";
import PropertiesData = main.PropertiesData;
import {useEffect, useState} from "react";
import {Button, Card, ColorInput, ColorSwatch, Grid, Group, Text} from "@mantine/core";
import {modals} from "@mantine/modals";

export interface ColorsEditProps{
    selectedData: PropertiesData
    stateChanger: (propsData: PropertiesData)=>void
}

export function ColorsEditScreen({selectedData, stateChanger}: ColorsEditProps) {

    const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(-1)
    const [selectedPropertyValue, setSelectedPropertyValue] = useState("")
    const [selectedPropertyKey, setSelectedPropertyKey] = useState("")

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
                    </Group>
                </>

            ),
        })
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

    return (
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
    )
}