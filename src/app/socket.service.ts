import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
@Injectable({
  providedIn: "root",
})
export class SocketService {
  socket;

  constructor() {
    this.socket = io.connect("https://www.finexus.com.co:5002", {
      secure: true
    })
  }

  setSize(socketId, size) {
    this.socket.emit("setSize", {
      id: socketId,
      height: size,
    });
  }

  scrollTop(socketId, size) {
    this.socket.emit("scrollTop", {
      id: socketId,
      height: size,
    });
  }
}
