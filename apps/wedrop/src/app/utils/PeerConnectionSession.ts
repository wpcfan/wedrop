import { io, Socket } from 'socket.io-client';

const { RTCPeerConnection, RTCSessionDescription } = window;

class PeerConnectionSession {
  _onConnected: (ev: any, id: string) => void = (ev: any, id: string) => {
    console.log(ev);
  };
  _onDisconnected: (ev: any, id: string) => void = (ev: any, id: string) => {
    console.log(ev);
  };
  private _room = '';
  peerConnections: Record<string, RTCPeerConnection> = {};
  senders: RTCRtpSender[] = [];
  listeners: Record<string, (ev: unknown) => void> = {};
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
    this.onCallMade();
  }

  addPeerConnection(
    id: string,
    stream: MediaStream,
    callback: (ev: any) => void
  ) {
    this.peerConnections[id] = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    stream.getTracks().forEach((track: MediaStreamTrack) => {
      this.senders.push(this.peerConnections[id].addTrack(track, stream));
    });

    switch (this.peerConnections[id].connectionState) {
      case 'connected':
        this.listeners[id] = (event) => this._onConnected(event, id);
        break;
      case 'disconnected':
        this.listeners[id] = (event) => this._onDisconnected(event, id);
        break;
      default:
        break;
    }

    this.peerConnections[id].addEventListener(
      'connectionstatechange',
      this.listeners[id]
    );

    this.peerConnections[id].ontrack = function ({ streams: [stream] }) {
      console.log({ id, stream });
      callback(stream);
    };

    console.log(this.peerConnections);
  }

  removePeerConnection(id: string) {
    this.peerConnections[id].removeEventListener(
      'connectionstatechange',
      this.listeners[id]
    );
    delete this.peerConnections[id];
    delete this.listeners[id];
  }

  isAlreadyCalling = false;

  async callUser(to: string) {
    if (this.peerConnections[to].iceConnectionState === 'new') {
      const offer = await this.peerConnections[to].createOffer();
      await this.peerConnections[to].setLocalDescription(
        new RTCSessionDescription(offer)
      );

      this.socket.emit('call-user', { offer, to });
    }
  }

  onConnected(callback: (ev: any, id: string) => void) {
    this._onConnected = callback;
  }

  onDisconnected(callback: (ev: any, id: string) => void) {
    this._onDisconnected = callback;
  }

  joinRoom(room: string) {
    this._room = room;
    this.socket.emit('joinRoom', room);
  }

  onCallMade() {
    this.socket.on('call-made', async (data) => {
      await this.peerConnections[data.socket].setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnections[data.socket].createAnswer();
      await this.peerConnections[data.socket].setLocalDescription(
        new RTCSessionDescription(answer)
      );

      this.socket.emit('make-answer', {
        answer,
        to: data.socket,
      });
    });
  }

  onAddUser(callback: (ev: any) => void) {
    this.socket.on(`${this._room}-add-user`, async ({ user }) => {
      callback(user);
    });
  }

  onRemoveUser(callback: (ev: any) => void) {
    this.socket.on(`${this._room}-remove-user`, ({ socketId }) => {
      callback(socketId);
    });
  }

  onUpdateUserList(callback: (users: string[], current: any) => void) {
    this.socket.on(`${this._room}-update-user-list`, ({ users, current }) => {
      callback(users, current);
    });
  }

  onAnswerMade(callback: (ev: any) => void) {
    this.socket.on('answer-made', async (data) => {
      await this.peerConnections[data.socket].setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      callback(data.socket);
    });
  }

  clearConnections() {
    this.socket.close();
    this.senders = [];
    Object.keys(this.peerConnections).forEach(
      this.removePeerConnection.bind(this)
    );
  }
}

export const createPeerConnectionContext = () => {
  const socket = io(
    process.env['REACT_APP_SOCKET_URL'] || 'http://localhost:3333/wedrop'
  );

  return new PeerConnectionSession(socket);
};
