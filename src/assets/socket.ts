import { default as eventBus } from '../assets/eventBus';

console.log('in socket.ts')
export class StatsSocket {
  private static instance: StatsSocket
  private readonly url: string;
  private socket: WebSocket | null = null;
  
  private constructor(private readonly uri: string) {
    this.url = uri;
    console.log(uri)
    this.connect();
  }

  public static new(uri: string): StatsSocket {
    return this.instance ?? (this.instance = new this(uri))
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', () => console.log('Connected to stats server'));

    this.socket.addEventListener('message', (data: MessageEvent) => {
      try {
        const msg = JSON.parse(data.data)
        eventBus.$emit('update', { data: msg.data, topic: msg.topic.split('/')[1] });
      } catch {
        return;
      }
    });

    this.socket.addEventListener('close', () => {
      console.log('Disconnected from stats server');
      this.reconnect();
    });
  }

  reconnect() { setTimeout(this.connect.bind(this), 2500); }
  close() { if (this.socket) this.socket.close(); }
}

