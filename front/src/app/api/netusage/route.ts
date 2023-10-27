import EventSource from "eventsource";

// 선언하여 app router의 동적 렌더링 방식을 설정하는 것 (반대는 'force-static')
export const dynamic = 'force-dynamic';

export async function GET() {
	let responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const resp = new EventSource("http://localhost:3333/api/netusage")
	resp.onmessage = async (e:any) => {
		await writer.write(encoder.encode(`event: message\ndata: ${e.data}\n\n`));
	}

	resp.onerror = () => {
                resp.close();
		await writer.close();
	}

	return new Response(responseStream.readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
		},
	});
}