import React, { useEffect } from "react";
import { ColorByName, ColorDef } from "@bentley/imodeljs-common";
import { NumberInput, Select } from "@bentley/ui-core";
import { GeometryQuery, Polyface, PolyfaceBuilder, StrokeOptions } from "@bentley/geometry-core";
import { AbstractWidgetProps, StagePanelLocation, StagePanelSection, UiItemsProvider, WidgetState } from "@bentley/ui-abstract";
import { IModelApp, Viewport, ScreenViewport, ViewState } from "@bentley/imodeljs-frontend";
import { GeometryDecorator } from "./GeometryDecorator";
import "./GeometryWidget.scss";
import Animation3dApi from "./AnimationApi";
import { AnalysisDecorator, AnalysisDecoratorHolder } from "./AnalysisDecorator";
const meshTypes = ["Cantilever", "Flat with waves"];

export const Simple3dWidget: React.FunctionComponent = () => {
  // const [decoratorState, setDecoratorState] = React.useState<GeometryDecorator>();
   const [decoratorState, setDecoratorState] =React.useState<AnalysisDecorator>();
  const [meshType, setMeshType] = React.useState<{ Column1: string, Column2: string[] }>({ Column1: "Cantilever", Column2: [] });
  const [stylePicker, setStylePicker] = React.useState<string>();
  const vp = IModelApp.viewManager.selectedView;

  const _drawAnimation = async (meshingType: string) => {
    if (vp) {
      console.log(`Type received from useEffect ${meshingType}`);
      const meshes = await Promise.all([
        Animation3dApi.createMesh("Cantilever", 100),
        Animation3dApi.createMesh("Flat with waves"),
      ]);
      const mesh = meshingType === "Cantilever" ? meshes[0] : meshes[1];
      if (AnalysisDecoratorHolder.decorator)
        AnalysisDecoratorHolder.decorator.dispose();

      AnalysisDecoratorHolder.decorator = new AnalysisDecorator(vp, mesh);
      // decorator.dispose();
      console.log(AnalysisDecoratorHolder.decorator.mesh.styles);
      const style: string[] = [];
      AnalysisDecoratorHolder.decorator.mesh.styles.forEach((value, key) => {
        console.log(`Keys ${key} Values ${value}`);
        style.push(key);
      });
      // const b = { Column1: meshingType, Column2: [...style] };
      // console.log("Mesh Type Data-" + JSON.stringify(b));
      setMeshType({ Column1: meshingType, Column2: [...style] });
    }
    //   meshType.forEach((value, key) => {
    //     console.log(`"meshType-" ${key} "Values-" ${value} length- ${meshType.length}`);
    // });

    // for (const style of meshStyle) {
    //   console.log(`style- ${style} `);
    // }
  };

  useEffect(() => {
    console.log("Inside useEffect");
    _drawAnimation("Cantilever");
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    _drawAnimation(event.target.value);
  };

  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    // console.log("event=" + event.target.value);
    vp!.displayStyle.settings.analysisStyle =
      AnalysisDecoratorHolder.decorator.mesh.styles.get(event.target.value);
    setStylePicker(event.target.value);
  };

  return (
    <>
      <div className="sample-options">
        <div className="sample-options-2col">
          <span>Mesh Picker:</span>
          <Select options={meshTypes} value={meshType.Column1} onChange={(event) => handleChange(event)} />
          <span>Style Picker:</span>
          <Select options={meshType.Column2} onChange={(event) => handleStyleChange(event)} />
        </div>
      </div>
    </>
  );
};

export class AnimationWidgetProvider implements UiItemsProvider {
  public readonly id: string = "AnimationWidgetProvider";

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push(
        {

          id: "AnimationWidgetProvider",
          label: "Visualization Controls",
          // defaultState: WidgetState.Floating,
          // eslint-disable-next-line react/display-name
          getWidgetContent: () => <Simple3dWidget />,
        }
      );
    }
    return widgets;
  }
}
