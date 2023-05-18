// noinspection DuplicatedCode

import {main} from "../../wailsjs/go/models";
import PropertiesData = main.PropertiesData;
import {ChangeEvent, useEffect, useState} from "react";
import {modals} from "@mantine/modals";
import {Button, Card, Grid, Group, Text, TextInput} from "@mantine/core";


export interface MiscEditProps{
    selectedData: PropertiesData
    stateChanger: (propsData: PropertiesData)=>void
}
export function MiscPropsEditScreen ({selectedData, stateChanger}: MiscEditProps) {
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
                    <TextInput placeholder={selectedPropertyValue} value={selectedPropertyValue} onChange={(event: ChangeEvent<HTMLInputElement>) => setSelectedPropertyValue(event.currentTarget.value)}/>
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