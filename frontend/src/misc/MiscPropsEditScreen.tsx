// noinspection DuplicatedCode

import {main} from "../../wailsjs/go/models";
import PropertiesData = main.PropertiesData;
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {modals} from "@mantine/modals";
import {ActionIcon, Button, Card, Grid, Group, Space, Text, TextInput} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";


export interface MiscEditProps{
    selectedData: PropertiesData
    stateChanger: (propsData: PropertiesData)=>void
}
export function MiscPropsEditScreen ({selectedData, stateChanger}: MiscEditProps) {
    const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(-1)
    const [selectedPropertyValue, setSelectedPropertyValue] = useState("")
    const [selectedPropertyKey, setSelectedPropertyKey] = useState("")
    const miscPropRef = useRef<HTMLInputElement>(null)
    const miscPropTitleRef = useRef<HTMLInputElement>(null)

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
            title: 'Create property',
            centered: true,
            children: (
                <>
                    <TextInput ref={miscPropTitleRef} label="Property name" placeholder="Property name" data-autofocus />
                    <TextInput ref={miscPropRef} label="Property value" placeholder="Property value" data-autofocus />
                    <Button fullWidth onClick={()=> {
                        // @ts-ignore
                        selectedData.data.push(miscPropTitleRef.current.value + "=" + miscPropRef.current.value);
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