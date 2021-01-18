import { Icon, Stack } from "@fluentui/react";
import * as React from "react";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import * as Styles from "./Config.style";
import { ConfigCheckboxes, ISections } from "./models";

interface IDraggableSectionProps {
  /** ConfigCheckbox text used in the section card as an ID */
  id: ConfigCheckboxes;
  /** Container object for the state of the section */
  sectionCard: ISections;
  /** Pass through renderer for displaying the section card's checkboxes */
  renderCheckbox: (id: ConfigCheckboxes, checked: boolean) => React.ReactNode;
  /** Initial index that the card is located in the section order array */
  initialIndex: number;
  /** Handle section card movement in the list */
  moveCard: (id: string, to: number) => void;
  /** Handle retrieving card index based on the ID */
  findCard: (id: string) => { index: number };
}

/**
 * Renders the drag and drop section cards and handles its drag and drop capabilities.
 * @param props See IDraggableSectionProps definition
 */
export const DraggableSection: React.FC<IDraggableSectionProps> = (props: IDraggableSectionProps) => {
  const originalIndex = props.initialIndex;
  const id = props.id;
  const [{ isDragging, opacity }, drag, preview] = useDrag({
    item: { type: props.sectionCard.type, id, originalIndex },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    end: (_, monitor: DragSourceMonitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        props.moveCard(droppedId, originalIndex);
      }
    },
  });

  const [, drop] = useDrop({
    accept: props.sectionCard.type,
    canDrop: () => false,
    hover({ text: draggedId }: ISections) {
      if (draggedId !== id) {
        const { index: overIndex } = props.findCard(id);
        props.moveCard(draggedId, overIndex);
      }
    },
  });

  return (
    <div ref={(node) => preview(drop(node))} id={props.sectionCard.text} style={Styles.sectionContainerStyle(opacity)}>
      <div style={Styles.emulatedStackStyle()}>
        <div ref={drag}>
          <Icon iconName="GlobalNavButton" styles={Styles.dragHandleStyle(isDragging)} />
        </div>
        {props.sectionCard.text !== ConfigCheckboxes.lastGamePlaying &&
          props.renderCheckbox(props.sectionCard.text, props.sectionCard.checked)}
        {props.sectionCard.text === ConfigCheckboxes.lastGamePlaying && (
          <Stack>
            {props.renderCheckbox(props.sectionCard.text, props.sectionCard.checked)}
            <div>
              <Icon iconName="Childof" styles={Styles.childOfStyle()} />
              {props.sectionCard.childText &&
                props.sectionCard.childChecked &&
                props.renderCheckbox(props.sectionCard.childText, props.sectionCard.childChecked)}
            </div>
          </Stack>
        )}
      </div>
    </div>
  );
};
