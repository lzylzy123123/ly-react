/* eslint-disable @typescript-eslint/no-explicit-any */
import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatcher } from 'react/src/currentDispatcher';
import { Dispatch } from 'react/src/currentDispatcher';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enQueueUpdate,
	processUpdateQueue
} from './updateQueue';
import { Action } from 'shared/reactTypes';
import { scheduledUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;

const { currentDispatcher } = internals;
interface Hook {
	memorizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}
export function renderWithHooks(wip: FiberNode) {
	currentlyRenderingFiber = wip;
	wip.memorizedState = null;
	const current = wip.alternate;
	if (current !== null) {
		currentDispatcher.current = HookDispatcherOnUpdate;
	} else {
		currentDispatcher.current = HookDispatcherOnMount;
	}
	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	currentlyRenderingFiber = null;
  workInProgressHook = null;
  currentHook = null;
	return children;
}

const HookDispatcherOnMount: Dispatcher = {
	useState: mountState
};

const HookDispatcherOnUpdate: Dispatcher = {
	useState: UpdateState
};

function UpdateState<State>(): [State, Dispatch<State>] {
	const hook = updateWorkInProgressHook();
	const queue = hook.updateQueue as UpdateQueue<State>;
	const pending = queue.shared.pending;

	if (pending !== null) {
		const { memorizedState } = processUpdateQueue(hook.memorizedState, pending);
		hook.memorizedState = memorizedState;
	}
	return [hook.memorizedState, queue.dispatch as Dispatch<State>];
}

function updateWorkInProgressHook(): Hook {
	let nextCurrentHook: Hook | null;
	if (currentHook === null) {
		const current = currentlyRenderingFiber?.alternate;
		if (current !== null) {
			nextCurrentHook = current?.memorizedState;
		} else {
			nextCurrentHook = null;
		}
	} else {
		nextCurrentHook = currentHook.next;
	}

	if (nextCurrentHook === null) {
		throw new Error(
			`组件${currentlyRenderingFiber?.type}本次执行时的Hook比上次执行时多`
		);
	}
	currentHook = nextCurrentHook as Hook;
	const newHook = {
		memorizedState: currentHook.memorizedState,
		updateQueue: currentHook.updateQueue,
		next: null
	};

	if (workInProgressHook === null) {
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = newHook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		workInProgressHook.next = newHook;
		workInProgressHook = newHook;
	}

	return workInProgressHook;
}
function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	const hook = mountWorkInProgressHook();
	let memorizedState;
	if (initialState instanceof Function) {
		memorizedState = initialState();
	} else {
		memorizedState = initialState;
	}
	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memorizedState = memorizedState;
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;
	return [memorizedState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enQueueUpdate(updateQueue, update);
	scheduledUpdateOnFiber(fiber);
}
function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memorizedState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
