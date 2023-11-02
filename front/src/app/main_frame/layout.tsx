
// import  WebSocketProvider  from '../websocket/page';
import  WebSocketProvider  from './socket_provider';

export default function MainframeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    
    console.log('MainFrame Layout');

    return (

    <section>
        <WebSocketProvider>
            {children}
        </WebSocketProvider>
    </section>
    
    );
        
}