import {SegmentedControl, useMantineTheme} from "@mantine/core";
import {SegmentedControlItem} from "@mantine/core/lib/SegmentedControl/SegmentedControl";

export interface SegmentedPropsControlProps {
    onChange: (selected: string) => void
    values: SegmentedControlItem[]
    initialValue: string
}

export function PropertiesSegmentedControl({onChange, values, initialValue}: SegmentedPropsControlProps) {

    const theme = useMantineTheme();
    return (
        <div className={"segmented-control"}>
            <SegmentedControl value={initialValue} onChange={(value: string)=> {
                    onChange(value)
                }
            }
                color={theme.colors["brand"]}
                data={values}
            />
        </div>

    )
}