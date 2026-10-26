import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, WeightRecord, CompletedWorkout } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts'
];

const provider = new GoogleAuthProvider();
DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token caching (MANDATORY: never in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Falha ao obter o token de acesso do Google.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erro no login do Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface AppBackupData {
  appName: string;
  version: string;
  exportedAt: string;
  userProfile: UserProfile;
  completedDays: number[];
  completedWorkouts: CompletedWorkout[];
  weightRecords: WeightRecord[];
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

/**
 * Uploads a JSON backup of workout progress to Google Drive.
 */
export const backupToGoogleDrive = async (
  backupData: AppBackupData,
  fileName = `treino_em_casa_backup_${new Date().toISOString().slice(0, 10)}.json`
): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado com o Google Drive.');

  const fileContent = JSON.stringify(backupData, null, 2);
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: 'Backup de dados do aplicativo Treino em Casa meu suor!'
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append(
    'file',
    new Blob([fileContent], { type: 'application/json' })
  );

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Erro ao enviar backup para o Google Drive');
  }

  return await res.json();
};

/**
 * Lists backup files and reports created by the app in Google Drive.
 */
export const listGoogleDriveBackups = async (): Promise<DriveFileItem[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado com o Google Drive.');

  const query = encodeURIComponent("trashed = false and (name contains 'treino_em_casa' or name contains 'meu_suor' or mimeType = 'application/json')");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)&orderBy=modifiedTime desc&pageSize=20`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Erro ao listar arquivos do Google Drive');
  }

  const data = await res.json();
  return data.files || [];
};

/**
 * Downloads a backup JSON file from Google Drive and parses it.
 */
export const downloadGoogleDriveBackup = async (fileId: string): Promise<AppBackupData> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado com o Google Drive.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Falha ao baixar o arquivo de backup do Google Drive');
  }

  return await res.json();
};

/**
 * Exports a readable training log report to Google Drive as a document/text file.
 */
export const exportReportToGoogleDrive = async (
  reportTitle: string,
  reportText: string
): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado com o Google Drive.');

  const fileName = `${reportTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    description: 'Relatório de Treinos e Evolução Corporal - Treino em Casa meu suor!'
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append(
    'file',
    new Blob([reportText], { type: 'text/plain' })
  );

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Erro ao salvar relatório no Google Drive');
  }

  return await res.json();
};

/**
 * Deletes a file from Google Drive.
 * MANDATORY: Requires explicit user confirmation dialog before calling this!
 */
export const deleteGoogleDriveFile = async (fileId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado com o Google Drive.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Erro ao excluir arquivo do Google Drive');
  }
};
