// noinspection DuplicatedCode

import {ActionIcon, Button, Card, Grid, Group, Space, Text, TextInput} from "@mantine/core";
import {DropArea, MimeType} from "./DropArea";
import {PropertiesSegmentedControl} from "./PropertiesSegmentedControl";
import {main} from "../../wailsjs/go/models";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {SegmentedControlItem} from "@mantine/core/lib/SegmentedControl/SegmentedControl";
import {modals} from '@mantine/modals';
import {FileWithPath} from "@mantine/dropzone";
import {IconTrash} from "@tabler/icons-react";
import PropertiesData = main.PropertiesData;

export interface AppInfoScreenProps{
    onChange: (selected: string) => void
    selectedData: PropertiesData
    stateChanger: (propsData: PropertiesData) => void
    onGoogleServicesJsonReady:(jsonFile: FileWithPath) => void
    onColorsDataReady:(jsonFile: FileWithPath) => void
    onZipReady:(jsonFile: FileWithPath) => void
    onAppNameChange: (appName: string) => void
    onPackageChange: (packageName: string) => void
    initialSelectedPropPage: string
}
export function AppInfoScreen ({onChange, selectedData, stateChanger, onGoogleServicesJsonReady, onColorsDataReady, onZipReady, onAppNameChange, onPackageChange, initialSelectedPropPage}: AppInfoScreenProps) {
    const propsPages: SegmentedControlItem[] = [{
        label: "Staging",
        value: "staging"
    }, {
        label: "Playstore",
        value: "playstore"
    }, {
        label: "NonPlaystore",
        value: "nonplaystore"
    }]

    const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(-1)
    const [selectedPropertyValue, setSelectedPropertyValue] = useState("")
    const [selectedPropertyKey, setSelectedPropertyKey] = useState("")
    const [selectedPropertyData, setSelectedPropertyData] = useState(null)
    const nameRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);

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
                        <Button onClick={resetEditState} >
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
                    <TextInput ref={nameRef} label="Property name" placeholder="Property name" data-autofocus />
                    <TextInput ref={valueRef} label="Property value" placeholder="Property value" data-autofocus />
                    <Button fullWidth onClick={()=> {
                            // @ts-ignore
                            selectedData.data.push(nameRef.current.value + "=" + valueRef.current.value);
                            stateChanger(selectedData)
                            resetEditState()
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
        if(selectedData != null) {
            // @ts-ignore
            setSelectedPropertyData(selectedData)
        }
    }, [selectedData])



    useEffect(() => {
       if(selectedPropertyIndex != -1 && selectedPropertyValue.length > 0) {
           editProperty(selectedPropertyIndex)
       }
    },[selectedPropertyIndex, selectedPropertyValue])

    return (
        <>
            <Grid columns={2}>
                <Grid.Col span={1}><TextInput placeholder={"Application name"} label={"Please specify the application name"} withAsterisk={true} onChange={(event: ChangeEvent<HTMLInputElement>) => onAppNameChange(event.currentTarget.value)}/></Grid.Col>
                <Grid.Col span={1}><TextInput placeholder={"Application package"} label={"Please specify the application package name"} withAsterisk={true} onChange={(event: ChangeEvent<HTMLInputElement>) => onPackageChange(event.currentTarget.value)}/></Grid.Col>
            </Grid>
            <Space h={16}/>
            <Grid columns={2}>
                <Grid.Col span={1}><DropArea mimeType={MimeType.json} normalText={"Drop your google services json"} onSelect={onGoogleServicesJsonReady}/></Grid.Col>
                <Grid.Col span={1}><DropArea mimeType={MimeType.json} normalText={"Drop your colors json"} onSelect={onColorsDataReady}/></Grid.Col>
            </Grid>
            <Space h={16}/>
            <PropertiesSegmentedControl onChange={(selected: string)=> {
                onChange(selected)
            }} values={propsPages} initialValue={initialSelectedPropPage}/>
            <Button variant="filled" onClick={()=>{
                createProperty()
            }}>Add new</Button>
            <Space h={16}/>
            <Grid columns={3} className={"props-grid"}>
                {
                    selectedData.data.map((value, index) => (
                        <Grid.Col span={1}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder key={index}>
                                <Group position="apart" mt="md" mb="xs">
                                    <Text truncate weight={500}>{value.split("=")[0]}</Text>
                                </Group>
                                <Text truncate>
                                    {value.split("=")[1]}
                                </Text>
                                <Button fullWidth mt="md" radius="sm" onClick={()=>{
                                    setSelectedPropertyIndex(index)
                                    const propertyParts = selectedData.data[index].split("=")
                                    setSelectedPropertyKey(propertyParts[0])
                                    setSelectedPropertyValue(propertyParts[1])
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