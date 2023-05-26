import './App.css';
import {
    LoadingOverlay,
    MantineProvider
} from '@mantine/core';
import {AppInfoScreen} from "./appinfoandprops/AppInfoScreen";
import {useEffect, useState} from "react";
import {main} from "../wailsjs/go/models";
import {ReadProperties, Save} from "../wailsjs/go/main/App";
import {ModalsProvider} from "@mantine/modals";
import PropertiesData = main.PropertiesData;
import {NavigationOption, WhiteLabelHeader} from "./navigation/WhiteLabelHeader";
import {ColorsEditScreen} from "./colors/ColorsEditScreen";
import {MiscPropsEditScreen} from "./misc/MiscPropsEditScreen";
import {LogPrint} from "../wailsjs/runtime";
import {FileWithPath} from "@mantine/dropzone";
import {getBytesFromFile, readZipFile} from "./utils/FileUtils";

function App() {

    // @ts-ignore
    const [envPropertiesData, setEnvPropertiesData] = useState<PropertiesData[]>(null)
    // @ts-ignore
    const [selectedData, setSelectedData] = useState<PropertiesData>(null)
    const [navOption, setNavOption] = useState(0)
    const [appPackage, setAppPackage] = useState("")
    const [appName, setAppName] = useState("")
    // @ts-ignore
    const [zipFile, setZipFile] = useState<FileWithPath>(null)
    // @ts-ignore
    const [jsonFile, setJsonFile] = useState<FileWithPath >(null)
    const [selectedPropsPage, setSelectedPropsPage] = useState("staging")

    const links = [
        {
            link:NavigationOption.AppProperties,
            label:"App properties"
        }, {
            link:NavigationOption.Colors,
            label:"Colors"
        },{
            link:NavigationOption.Misc,
            label:"Misc"
        }
    ]

    const handleNavChange = (navIndex: number) => {
        setNavOption(navIndex)
    }

    const renderScreen = () => {
        switch (navOption) {
            case 0:
                return <AppInfoScreen selectedData={getDataByName(selectedPropsPage)} onChange={(selected: string) => {
                    handlePropsPageChange(selected)
                }} stateChanger={stageChanger} onZipReady={setZipFile} onJsonFileReady={setJsonFile} onAppNameChange={(appName: string)=> {
                    setAppName(appName)
                }} onPackageChange={(appPackage: string)=> {
                    setAppPackage(appPackage)
                }} initialSelectedPropPage={selectedPropsPage}/>
            case 1:
                LogPrint("UPDATE COLORS in colors")
                return <ColorsEditScreen selectedData={getDataByName("colors")}  stateChanger={stageChanger}/>
            case 2:
                return <MiscPropsEditScreen selectedData={getDataByName("misc_props")}  stateChanger={stageChanger}/>
        }
    }

    // @ts-ignore
    const getDataByName = (name: string): PropertiesData => {
        for (let i = 0; i < envPropertiesData.length; i++) {
            if (envPropertiesData[i].name === name) {
               return envPropertiesData[i]
            }
        }
    }

    const handleChange = (
        selected: string,
    ) => {
        for (let i = 0; i < envPropertiesData.length; i++) {
            if (envPropertiesData[i].name === selected) {
                setSelectedData(envPropertiesData[i])
                break
            }
        }
    }

    const handlePropsPageChange = (
        selected: string,
    ) => {
        setSelectedPropsPage(selected)
        handleChange(selected)
    }

    const deepCopyCurrentPropsArray = (): PropertiesData[] => {
        let updated = JSON.stringify(envPropertiesData)
        return JSON.parse(updated)
    }

    const stageChanger = (propsData: PropertiesData) => {
        const updated = deepCopyCurrentPropsArray()
        setEnvPropertiesData(updated)
        setSelectedData(propsData)
    }


    const save = () => {
        readZipFile(zipFile).then((zipFile)=> {
            let zipNamesArr = new Array<string>()
            let zipNamesBlobs = new Array<string>()
            zipFile.forEach((value, key) => {
                zipNamesArr.push(key)
                zipNamesBlobs.push(value)
            })
            getBytesFromFile(jsonFile).then(value =>  {
                Save(appName, appPackage, envPropertiesData, zipNamesArr, zipNamesBlobs, value).then((err) => {
                    if(err != null && err.error != null){
                        LogPrint("Error saving whitelabel")
                    } else {
                        LogPrint("Saved")
                    }
                })
            })

        })
        /*const errors = checkForErrors(appName,
            appPackage,
            zipFile,
            jsonFile)
        if(errors.length > 0) {
            modals.open({
                title: "There be errors. Argh!",
                centered: true,
                children: (
                    <>
                        {
                            errors.map((value, index) => (
                                <Text color={'#ff0000'}>{value.toString()}</Text>
                            ))
                        }
                    </>
                )
            })
        } else {

        }*/
    }

    useEffect(() => {
        ReadProperties().then((result) => {
            setEnvPropertiesData(result)
            setSelectedData(result[0])
        })
    }, [])

    if (envPropertiesData == null && selectedData == null) {
        return (<LoadingOverlay visible={true} overlayBlur={2}/>)
    } else {
        return (
            <MantineProvider theme={{
                colors: {
                    brand: ['#e1f2ff', '#b5d4fd', '#88b8f7', '#5a9bf1', '#2d7feb', '#1466d2', '#094fa4', '#033876', '#00224a', '#000c1e'],
                },
                primaryColor: 'brand',
            }}
            >
                <ModalsProvider>
                    <div id="App">
                        <WhiteLabelHeader links={links} onNavigate={handleNavChange} onSave={save}/>
                        {renderScreen()}
                    </div>
                </ModalsProvider>
            </MantineProvider>

        )
    }
}

export default App
