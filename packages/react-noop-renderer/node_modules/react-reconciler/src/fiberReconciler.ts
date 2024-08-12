import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enQueueUpdate
} from './updateQueue';
import { ReactElementType } from 'shared/reactTypes';
import { scheduledUpdateOnFiber } from './workLoop';
import { requestUpdateLane } from './fiberLanes';

export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
  const lane = requestUpdateLane();
	const update = createUpdate<ReactElementType | null>(element,lane);
	enQueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	scheduledUpdateOnFiber(hostRootFiber,lane);
	return element;
}
