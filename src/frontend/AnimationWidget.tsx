import React, { useEffect } from "react";
import { ColorByName, ColorDef } from "@bentley/imodeljs-common";
import { NumberInput, Select } from "@bentley/ui-core";
import { GeometryQuery, Polyface, PolyfaceBuilder, StrokeOptions } from "@bentley/geometry-core";
import { AbstractWidgetProps, StagePanelLocation, StagePanelSection, UiItemsProvider, WidgetState } from "@bentley/ui-abstract";
import { IModelApp, Viewport, ScreenViewport, ViewState } from "@bentley/imodeljs-frontend";
import { GeometryDecorator } from "./GeometryDecorator";
import "./GeometryWidget.scss";
import Animation3dApi, { AnalysisMesh } from "./AnimationApi";

export const Simple3dWidget: React.FunctionComponent = () => {
  const [decoratorState, setDecoratorState] = React.useState<GeometryDecorator>();
  const [type, setType] = React.useState<string>("Cantilever");

  useEffect(() => {
    if (!decoratorState) {
      const decorator = new GeometryDecorator();
      IModelApp.viewManager.addDecorator(decorator);
      setDecoratorState(decorator);
    }

    return (() => {
      if (decoratorState)
        IModelApp.viewManager.dropDecorator(decoratorState);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    _drawAnimation();
  });

  //Rendering logic
  const _drawAnimation = async () => {
    // console.log("Inside _drawAnimation");
    if (!decoratorState)
      return;

    decoratorState.clearGeometry();
    // const options = StrokeOptions.createForFacets();
    // options.shouldTriangulate = true;
    // const builder = PolyfaceBuilder.create(options);

    if (type === "Cantilever") {
      const polyface = Animation3dApi.createCantilever();
      decoratorState.addGeometry(polyface);
    }
    else if (type === "Flat with waves") {
      const polyface = Animation3dApi.createFlatMeshWithWaves();
      decoratorState.addGeometry(polyface);
    }

    //const polyface = builder.claimPolyface();
    //decoratorState.addGeometry(mesh!.polyface);
    //decoratorState.decorate();

    //decoratorState.drawBase();

  };

  return (
    <>
      <div className="sample-options">
        <div className="sample-options-2col">
          <span>Analysis Mesh Type:</span>
          <Select options={["Cantilever", "Flat with waves"]} onChange={(event) => { setType(event.target.value); }} />
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
